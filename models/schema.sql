DROP TABLE IF EXISTS candidate;
CREATE TABLE candidate(
id serial NOT NULL,
fullname text,
age int,
education text,
experience int,
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
typeid int,
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
INSERT INTO contacttype (type) VALUES ('EMAIL');
INSERT INTO contacttype (type) VALUES ('PHONE');
INSERT INTO contacttype (type) VALUES ('MOBILE');

DROP TABLE IF EXISTS documenttype;
CREATE TABLE documenttype(
id serial NOT NULL,
type text,
updatetime timestamp without time zone,
createtime timestamp without time zone default now(),
CONSTRAINT documenttype_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
INSERT INTO documenttype (type) VALUES ('WORD');
INSERT INTO documenttype (type) VALUES ('PDF');

DROP TABLE IF EXISTS document;
CREATE TABLE document(
id serial NOT NULL,
candidateid int,
typeid int,
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


CREATE VIEW resume AS
(SELECT 
  candidate.id, 
  candidate.fullname, 
  candidate.age, 
  candidate.education, 
  candidate.experience, 
  contact.info AS contact, 
  document.filepath, 
  contacttype.type AS contacttype,
  documenttype.type AS documenttype,
  comment.info AS comment
FROM 
  public.candidate, 
  public.contact, 
  public.contacttype, 
  public.document, 
  public.documenttype,
  public.comment
WHERE 
  candidate.id = document.candidateid AND
  candidate.id = contact.candidateid AND
  candidate.id = comment.candidateid AND
  contact.typeid = contacttype.id AND
  document.typeid = documenttype.id );