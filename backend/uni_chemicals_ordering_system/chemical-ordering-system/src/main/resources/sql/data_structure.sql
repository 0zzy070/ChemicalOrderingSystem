CREATE TABLE public.authorities (
    username character varying(64) NOT NULL,
    authority character varying(64) NOT NULL,
    id character varying(64) NOT NULL
);


COMMENT ON COLUMN public.authorities.authority IS 'ROLE_ADMIN: Admin
ROLE_RESEARCH: Research Staff
ROLE_SUPERVISOR: Supervisor
ROLE_HIGHER_APPROVER: Higher Approver';


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
    supervisor_comment character varying(256),
    higher_approve_comment character varying(256),
    status smallint NOT NULL,
    order_comment character varying(256),
    chemical_id character varying(16),
    amount smallint,
    unit character(16),
    staff_submit_time bigint,
    higher_approve_time bigint,
    order_approve_time bigint,
    order_receive_time bigint,
    order_placed_time bigint,
    supervisor_approve_time bigint,
    supervisor_approve_status boolean,
    higher_approve_status boolean,
    order_approve_status boolean
);


COMMENT ON COLUMN public.experiment.status IS '0: wait for supervisor approve
1: wait for higher approver approve
2: wait for order confirm
3: Ordered
4: received
5: placed(order finished)';


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


CREATE TABLE public.users (
  id character varying(64) NOT NULL,
  employee_number character varying(32) NOT NULL,
  create_time bigint,
  update_time bigint,
  username character varying(64),
  password character varying(128),
  enabled boolean
      email character varying(128)
);


ALTER TABLE ONLY public.authorities
    ADD CONSTRAINT authorities_pkey PRIMARY KEY (id);


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


ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_username UNIQUE (username);


ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


CREATE UNIQUE INDEX ix_auth_username ON public.authorities USING btree (username, authority);

--init data
INSERT INTO public.authorities(
	username, authority, id)
	VALUES ('admin', 'ROLE_ADMIN', '0');

INSERT INTO public.users(
	id, employee_number,username, password, enabled)
	VALUES ('0', 'empoyNo001', 'admin1', '$2a$10$4rEUEA/mOQNbQqGYpX8rkuNXkopHBBl6QvkSCmbl0x2wpxcewoVBa', true);

INSERT INTO public.organizational_unit(
	id, pid, org_name, org_type, has_special_equipment, status)
	VALUES ('0', null, 'Flinders University', 1, null, -1);
