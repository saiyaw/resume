DROP TABLE IF EXISTS candidate;
CREATE TABLE candidate(
id serial NOT NULL,
fullname text,
age int,
workingyears int,
degreeid int,
selfevaluation text,
gender text,
address text,
estimateprice real,
email text,
phone text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT candidate_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS document;
CREATE TABLE document(
id serial NOT NULL,
candidateid int,
filepath text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT document_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS comment;
CREATE TABLE comment(
id serial NOT NULL,
candidateid int,
info text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT comment_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS experience;
CREATE TABLE experience(
id serial NOT NULL,
candidateid int,
company text,
periodid int,
position text,
responsibility text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT experience_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS period;
CREATE TABLE period(
id serial NOT NULL,
startdate date,
enddate date,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT period_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS degree;
CREATE TABLE degree(
id serial NOT NULL,
degree text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT degree_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS education;
CREATE TABLE education(
id serial NOT NULL,
candidateid int,
university text,
major text,
degreeid int,
periodid int,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT education_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS careerintention;
CREATE TABLE careerintention(
id serial NOT NULL,
candidateid int,
pricelow real,
pricehigh real,
position text,
industry text,
city text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT ecareerintention_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);