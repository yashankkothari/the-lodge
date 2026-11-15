import "server-only";

import snapshot from "@/config/github-contributions.json";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const QUERY = `
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

export type Contribution = {
  date: string;
  count: number;
};

type GitHubGraphQLResponse = {
  errors?: unknown;
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: {
            contributionDays: {
              date: string;
              contributionCount: number;
            }[];
          }[];
        };
      };
    };
  };
};

/**
 * The committed snapshot, used when no token is configured or the live call
 * fails. Refresh it with `npm run sync:contributions`.
 */
function snapshotContributions(): Contribution[] {
  return snapshot.days.map(({ date, count }) => ({ date, count }));
}

export async function fetchGithubData(
  username: string,
): Promise<Contribution[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return snapshotContributions();
  }

  const now = new Date();
  const from = new Date(now);
  from.setFullYear(now.getFullYear() - 1);

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          username,
          from: from.toISOString(),
          to: now.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("GitHub API request failed:", response.status);
      return snapshotContributions();
    }

    const json: GitHubGraphQLResponse = await response.json();

    if (json.errors) {
      console.error("GitHub API Errors:", json.errors);
      return snapshotContributions();
    }

    const weeks =
      json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ??
      [];

    const live = weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    );

    return live.length > 0 ? live : snapshotContributions();
  } catch {
    console.error("GitHub API request failed.");
    return snapshotContributions();
  }
}
