create table if not exists stripe.events
(
    id               text primary key,
    object           text,
    api_version      text,
    created          integer,
    data             jsonb,
    livemode         boolean,
    pending_webhooks integer,
    request          jsonb,
    type             text
);

create table if not exists stripe.products
(
    id                   text primary key,
    object               text,
    active               boolean,
    created              integer,
    default_price        text,
    description          text,
    images               jsonb,
    livemode             boolean,
    metadata             jsonb,
    name                 text,
    package_dimensions   jsonb,
    shippable            boolean,
    statement_descriptor text,
    tax_code             text,
    unit_label           text,
    updated              integer,
    url                  text
);

create type stripe.pricing_type as enum (
    'one_time',
    'recurring'
    );

create type stripe.pricing_tiers as enum (
    'graduated',
    'volume'
    );

create table if not exists stripe.prices
(
    id                  text primary key,
    object              text,
    active              boolean,
    billing_scheme      text,
    created             integer,
    currency            text,
    custom_unit_amount  jsonb,
    livemode            boolean,
    lookup_key          text,
    metadata            jsonb,
    nickname            text,
    product             text,
    recurring           jsonb,
    tax_behavior        text,
    tiers_mode          stripe.pricing_tiers,
    transform_quantity  jsonb,
    type                stripe.pricing_type,
    unit_amount         integer,
    unit_amount_decimal text
);

create table if not exists stripe.customers
(
    id                text primary key,
    object            text,
    address           jsonb,
    balance           integer,
    created           integer,
    currency          text,
    default_source    text,
    delinquent        boolean,
    description       text,
    discount          jsonb,
    email             text,
    invoice_prefix    text,
    invoice_settings  jsonb,
    livemode          boolean,
    metadata          jsonb,
    name              text,
    phone             text,
    preferred_locales jsonb,
    shipping          jsonb,
    tax_exempt        text
);

create type stripe.subscription_status as enum (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
    );

create table if not exists stripe.subscriptions
(
    id                                text primary key,
    object                            text,
    application                       text,
    application_fee_percent           double precision,
    automatic_tax                     jsonb,
    billing_cycle_anchor              integer,
    billing_thresholds                jsonb,
    cancel_at                         integer,
    cancel_at_period_end              boolean,
    canceled_at                       integer,
    collection_method                 text,
    created                           integer,
    currency                          text,
    current_period_end                integer,
    current_period_start              integer,
    customer                          text,
    days_until_due                    integer,
    default_payment_method            text,
    default_source                    text,
    default_tax_rates                 jsonb,
    description                       text,
    discount                          jsonb,
    ended_at                          integer,
    items                             jsonb,
    latest_invoice                    text,
    livemode                          boolean,
    metadata                          jsonb,
    next_pending_invoice_item_invoice integer,
    pause_collection                  jsonb,
    payment_settings                  jsonb,
    pending_invoice_item_interval     jsonb,
    pending_setup_intent              text,
    pending_update                    jsonb,
    schedule                          text,
    start_date                        integer,
    status                            stripe.subscription_status,
    test_clock                        text,
    transfer_data                     jsonb,
    trial_end                         jsonb,
    trial_start                       jsonb
);

create type stripe.invoice_status as enum (
    'draft',
    'open',
    'paid',
    'uncollectible',
    'void'
    );

create table if not exists stripe.invoices
(
    id                               text primary key,
    object                           text,
    account_country                  text,
    account_name                     text,
    account_tax_ids                  jsonb,
    amount_due                       integer,
    amount_paid                      integer,
    amount_remaining                 integer,
    application                      text,
    application_fee_amount           integer,
    attempt_count                    integer,
    attempted                        boolean,
    auto_advance                     boolean,
    automatic_tax                    jsonb,
    billing_reason                   text,
    charge                           text,
    collection_method                text,
    created                          integer,
    currency                         text,
    custom_fields                    jsonb,
    customer                         text,
    customer_address                 jsonb,
    customer_email                   text,
    customer_name                    text,
    customer_phone                   text,
    customer_shipping                jsonb,
    customer_tax_exempt              text,
    customer_tax_ids                 jsonb,
    default_payment_method           text,
    default_source                   text,
    default_tax_rates                jsonb,
    description                      text,
    discount                         jsonb,
    discounts                        jsonb,
    due_date                         integer,
    ending_balance                   integer,
    footer                           text,
    from_invoice                     jsonb,
    hosted_invoice_url               text,
    invoice_pdf                      text,
    last_finalization_error          jsonb,
    latest_revision                  text,
    lines                            jsonb,
    livemode                         boolean,
    metadata                         jsonb,
    next_payment_attempt             integer,
    number                           text,
    on_behalf_of                     text,
    paid                             boolean,
    paid_out_of_band                 boolean,
    payment_intent                   text,
    payment_settings                 jsonb,
    period_end                       integer,
    period_start                     integer,
    post_payment_credit_notes_amount integer,
    pre_payment_credit_notes_amount  integer,
    quote                            text,
    receipt_number                   text,
    rendering_options                jsonb,
    starting_balance                 integer,
    statement_descriptor             text,
    status                           stripe.invoice_status,
    status_transitions               jsonb,
    subscription                     text,
    subtotal                         integer,
    subtotal_excluding_tax           integer,
    tax                              integer,
    test_clock                       text,
    total                            integer,
    total_discount_amounts           jsonb,
    total_excluding_tax              integer,
    total_tax_amounts                jsonb,
    transfer_data                    jsonb,
    webhooks_delivered_at            integer
);

create type stripe.charges_status as enum (
    'succeeded',
    'pending',
    'failed'
    );

create table if not exists stripe.charges
(
    id                              text primary key,
    object                          text,
    amount                          integer,
    amount_captured                 integer,
    amount_refunded                 integer,
    application                     text,
    application_fee                 text,
    application_fee_amount          integer,
    balance_transaction             text,
    billing_details                 jsonb,
    calculated_statement_descriptor text,
    captured                        boolean,
    created                         integer,
    currency                        text,
    customer                        text,
    description                     text,
    disputed                        boolean,
    failure_balance_transaction     text,
    failure_code                    text,
    failure_message                 text,
    fraud_details                   jsonb,
    invoice                         text,
    livemode                        boolean,
    metadata                        jsonb,
    on_behalf_of                    text,
    outcome                         jsonb,
    paid                            boolean,
    payment_intent                  text,
    payment_method                  text,
    payment_method_details          jsonb,
    receipt_email                   text,
    receipt_number                  text,
    receipt_url                     text,
    refunded                        boolean,
    refunds                         jsonb,
    review                          text,
    shipping                        jsonb,
    source_transfer                 text,
    statement_descriptor            text,
    statement_descriptor_suffix     text,
    status                          stripe.charges_status,
    transfer_data                   jsonb,
    transfer_group                  text
);

create type stripe.coupons_duration as enum (
    'forever',
    'once',
    'repeating'
    );

create table if not exists stripe.coupons
(
    id                 text primary key,
    object             text,
    amount_off         integer,
    created            integer,
    currency           text,
    duration           stripe.coupons_duration,
    duration_in_months integer,
    livemode           boolean,
    max_redemptions    integer,
    metadata           jsonb,
    name               text,
    percent_off        double precision,
    redeem_by          integer,
    times_redeemed     integer,
    valid              boolean
);

create type stripe.disputes_status as enum (
    'won',
    'lost',
    'submitted',
    'unsubmitted',
    'expired'
    );

create table if not exists stripe.disputes
(
    id                   text primary key,
    object               text,
    amount               integer,
    balance_transactions jsonb,
    created              integer,
    currency             text,
    evidence             jsonb,
    status               stripe.disputes_status,
    transaction          text
);

create type stripe.plans_interval as enum (
    'day',
    'week',
    'month',
    'year'
    );

create table if not exists stripe.plans
(
    id                text primary key,
    object            text,
    active            boolean,
    aggregate_usage   text,
    amount            integer,
    amount_decimal    text,
    billing_scheme    text,
    created           integer,
    currency          text,
    interval          stripe.plans_interval,
    interval_count    integer,
    livemode          boolean,
    metadata          jsonb,
    nickname          text,
    product           text,
    tiers             jsonb,
    tiers_mode        text,
    transform_usage   text,
    trial_period_days integer,
    usage_type        text
);
