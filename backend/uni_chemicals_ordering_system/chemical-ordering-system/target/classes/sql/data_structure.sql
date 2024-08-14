CREATE TABLE public.chemical (
    id character varying(64) NOT NULL,
    common_name character varying(128),
    systematic_name character varying(128),
    risk_category smallint,
    storage_period smallint,
    create_time bigint,
    update_time bigint
);
COMMENT ON COLUMN public.chemical.risk_category IS '0:low
1:middle
2:high';

COMMENT ON COLUMN public.chemical.storage_period IS 'unit:day';


CREATE TABLE public.chemical_org_unit (
    id character varying(64) NOT NULL,
    experiment_id character varying(64) NOT NULL,
    chemical_id character varying(64) NOT NULL,
    storage_location_id character varying(64) NOT NULL,
    expire_date bigint
);


CREATE TABLE public.experiment (
    id character varying(64) NOT NULL,
    name character varying(128) NOT NULL,
    risk_assessment character varying(256),
    supervisor_approve_status bit(1),
    supervisor_comment character varying(256),
    higher_approve_status bit(1),
    higher_approve_comment character varying(256),
    status smallint NOT NULL,
    order_approve_status bit(1),
    order_comment character varying(256),
    chemical_id character varying(16),
    amount smallint,
    unit character(16),
    staff_submit_time bigint,
    higher_approve_time bigint,
    order_approve_time bigint,
    order_receive_time bigint,
    order_placed_time bigint,
    supervisor_approve_time bigint
);

COMMENT ON COLUMN public.experiment.supervisor_approve_status IS '0:reject    1:pass';

COMMENT ON COLUMN public.experiment.higher_approve_status IS '0:reject    1:pass';

COMMENT ON COLUMN public.experiment.status IS '0: wait for supervisor approve
1: wait for higher approver approve
2: wait for order confirm
3: Ordered 
4: received
5: placed(order finished)';

COMMENT ON COLUMN public.experiment.order_approve_status IS '0:reject    1:pass';

CREATE TABLE public.organizational_unit (
    id character varying(64) NOT NULL,
    pid character varying(64),
    org_name character varying(64),
    org_type smallint,
    has_special_equipment boolean,
    status smallint,
    create_time bigint,
    update_time bigint
);

COMMENT ON COLUMN public.organizational_unit.pid IS 'Institute''s pid is null';

COMMENT ON COLUMN public.organizational_unit.org_type IS '1: Institutes
2:Storage Locations
3:Research Centres
4: Laboratories';

COMMENT ON COLUMN public.organizational_unit.has_special_equipment IS 'true: it can store  dangers chemicals
false: it can not store  dangers chemicals';

COMMENT ON COLUMN public.organizational_unit.status IS '1: available     0:unavailable    ,mainly used for Storage Locations.others can set to -1';


CREATE TABLE public."user" (
    id character varying(64),
    user_name character varying(32) NOT NULL,
    pwd character varying(128) NOT NULL,
    employee_number character varying(32) NOT NULL,
    user_type smallint,
    create_time bigint,
    update_time bigint
);

COMMENT ON COLUMN public."user".user_type IS '0:administration
1:research staff
2:supervisor
3:higher approver
4:order manager
';


ALTER TABLE ONLY public.chemical_org_unit
    ADD CONSTRAINT chemical_org_unit_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.chemical
    ADD CONSTRAINT chemical_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.chemical
    ADD CONSTRAINT chemical_systematic_name_key UNIQUE (systematic_name);

ALTER TABLE ONLY public.experiment
    ADD CONSTRAINT experiment_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.organizational_unit
    ADD CONSTRAINT organizational_unit_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public."user"
    ADD CONSTRAINT uq_user_name UNIQUE (user_name);


ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (employee_number);


