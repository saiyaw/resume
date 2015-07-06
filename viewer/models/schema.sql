DROP TABLE IF EXISTS candidate;
CREATE TABLE candidate(
id serial NOT NULL,
fullname text,
age int,
workingyears int,
degree text,
selfevaluation text,
gender text,
address text,
estimateprice real,
email text,
phone text,
isvisible boolean default FALSE,
resumeid int,
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
position text,
responsibility text,
startdate date,
enddate date,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT experience_pkey PRIMARY KEY (id)
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
degree text,
startdate date,
enddate date,
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

DROP TABLE IF EXISTS skillpool;
CREATE TABLE skillpool(
id serial NOT NULL,
skill text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT skillpool_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS candidateskill;
CREATE TABLE candidateskill(
id serial NOT NULL,
candidateid int,
skillid int,
rank real,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT candidateskill_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


