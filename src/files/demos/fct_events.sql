{{ config(
    materialized='incremental',
    unique_key='event_id',
    incremental_strategy='merge'
) }}

select event_id, user_id, status, updated_at
from raw_events
{% if is_incremental() %}
  -- only new or changed rows, with a 3-day lookback for late arrivals
  where updated_at > (select max(updated_at) - interval 3 day from {{ this }})
{% endif %}
