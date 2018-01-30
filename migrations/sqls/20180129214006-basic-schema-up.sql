CREATE TABLE therapist (
  id       INT  NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email    TEXT NOT NULL,
  CONSTRAINT therapist_pk PRIMARY KEY (id),
  CONSTRAINT therapist_username_uq UNIQUE (username),
  CONSTRAINT therapist_email_uq UNIQUE (email)
);

CREATE SEQUENCE therapist_id_seq;

CREATE TABLE patient (
  id            INT NOT NULL,
  number        INT NOT NULL,
  first_name    TEXT,
  last_name     TEXT,
  sex           TEXT,
  phone_numbers TEXT [],
  emails        TEXT [],
  birthdate     DATE,
  fiscal_id     TEXT,
  address       TEXT,
  location      TEXT,
  zipcode       TEXT,
  bank_account  TEXT,
  notes         TEXT,
  CONSTRAINT patient_pk PRIMARY KEY (id),
  CONSTRAINT patient_fiscal_id_uq UNIQUE (fiscal_id)
);

CREATE SEQUENCE patient_id_seq;
CREATE SEQUENCE patient_number_seq
  START WITH 100000;

CREATE TABLE appointment_type (
  id   INT  NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  CONSTRAINT appointment_type_pk PRIMARY KEY (id),
  CONSTRAINT appointment_type_slug_uq UNIQUE (slug)
);

CREATE SEQUENCE appointment_type_id_seq;

CREATE TABLE appointment (
  id            INT      NOT NULL,
  therapist_id  INT      NOT NULL,
  patient_id    INT      NOT NULL,
  type_id       INT      NOT NULL,
  start         TIMESTAMP WITH TIME ZONE,
  "end"         TIMESTAMP WITH TIME ZONE,
  duration      INTERVAL NOT NULL,
  start_day_id  INT      NOT NULL,
  start_hour_id INT      NOT NULL,
  end_day_id    INT      NOT NULL,
  end_hour_id   INT      NOT NULL,
  notes         TEXT,
  CONSTRAINT appointment_pk PRIMARY KEY (id),
  CONSTRAINT appointment_therapist_id FOREIGN KEY (therapist_id) REFERENCES therapist (id),
  CONSTRAINT appointment_patient_id FOREIGN KEY (patient_id) REFERENCES patient (id),
  CONSTRAINT appointment_appointment_type_id FOREIGN KEY (type_id) REFERENCES appointment_type (id),
  CONSTRAINT appointment_uq_1 UNIQUE (therapist_id, patient_id, start, "end")
);

CREATE SEQUENCE appointment_id_seq;