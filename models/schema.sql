DROP TABLE IF EXISTS candidate;
CREATE TABLE candidate(
id serial NOT NULL,
fullname text,
firstname text,
lastname text,
age int,
education text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT candidate_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS contact;
CREATE TABLE contact(
id serial NOT NULL,
candidateid int,
typeid text,
info text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT contact_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

DROP TABLE IF EXISTS contacttype;
CREATE TABLE contacttype(
id serial NOT NULL,
type text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT contacttype_pkey PRIMARY KEY (id)
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

