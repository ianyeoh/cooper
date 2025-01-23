--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-01-19 20:35:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16430)
-- Name: Authentication; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Authentication";


ALTER SCHEMA "Authentication" OWNER TO postgres;

--
-- TOC entry 6 (class 2615 OID 16431)
-- Name: Budgeting; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Budgeting";


ALTER SCHEMA "Budgeting" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16405)
-- Name: Credentials; Type: TABLE; Schema: Authentication; Owner: postgres
--

CREATE TABLE "Authentication"."Credentials" (
    "Username" character varying(50) NOT NULL,
    "Password" character(60) NOT NULL
);


ALTER TABLE "Authentication"."Credentials" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16416)
-- Name: Sessions; Type: TABLE; Schema: Authentication; Owner: postgres
--

CREATE TABLE "Authentication"."Sessions" (
    "SessionId" integer NOT NULL,
    "Username" character varying(50),
    "IP" inet NOT NULL,
    "UserAgent" character varying(255) NOT NULL,
    "Started" timestamp with time zone DEFAULT now(),
    "Expires" timestamp with time zone
);


ALTER TABLE "Authentication"."Sessions" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16392)
-- Name: Users; Type: TABLE; Schema: Authentication; Owner: postgres
--

CREATE TABLE "Authentication"."Users" (
    "Username" character varying(50) NOT NULL,
    "FirstName" character varying(50) NOT NULL,
    "LastName" character varying(50) NOT NULL
);


ALTER TABLE "Authentication"."Users" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16415)
-- Name: sessions_sessionid_seq; Type: SEQUENCE; Schema: Authentication; Owner: postgres
--

CREATE SEQUENCE "Authentication".sessions_sessionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "Authentication".sessions_sessionid_seq OWNER TO postgres;

--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 221
-- Name: sessions_sessionid_seq; Type: SEQUENCE OWNED BY; Schema: Authentication; Owner: postgres
--

ALTER SEQUENCE "Authentication".sessions_sessionid_seq OWNED BY "Authentication"."Sessions"."SessionId";


--
-- TOC entry 224 (class 1259 OID 16433)
-- Name: Accounts; Type: TABLE; Schema: Budgeting; Owner: postgres
--

CREATE TABLE "Budgeting"."Accounts" (
    "Name" character varying(50) NOT NULL,
    "Bank" character varying(50) NOT NULL,
    "Description" character varying(255),
    "AccountId" integer NOT NULL,
    "Owner" character varying(50) NOT NULL
);


ALTER TABLE "Budgeting"."Accounts" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16444)
-- Name: Categories; Type: TABLE; Schema: Budgeting; Owner: postgres
--

CREATE TABLE "Budgeting"."Categories" (
    "Name" character varying(50) NOT NULL
);


ALTER TABLE "Budgeting"."Categories" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16451)
-- Name: Transactions; Type: TABLE; Schema: Budgeting; Owner: postgres
--

CREATE TABLE "Budgeting"."Transactions" (
    "TransactionId" integer NOT NULL,
    "Account" integer NOT NULL,
    "Date" date NOT NULL,
    "Description" character varying(255) NOT NULL,
    "Category" character varying(50) NOT NULL,
    "Amount" money NOT NULL,
    "Comments" character varying(500),
    "CreatedBy" character varying(50) NOT NULL
);


ALTER TABLE "Budgeting"."Transactions" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16450)
-- Name: Transactions_Account_seq; Type: SEQUENCE; Schema: Budgeting; Owner: postgres
--

CREATE SEQUENCE "Budgeting"."Transactions_Account_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "Budgeting"."Transactions_Account_seq" OWNER TO postgres;

--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 227
-- Name: Transactions_Account_seq; Type: SEQUENCE OWNED BY; Schema: Budgeting; Owner: postgres
--

ALTER SEQUENCE "Budgeting"."Transactions_Account_seq" OWNED BY "Budgeting"."Transactions"."Account";


--
-- TOC entry 226 (class 1259 OID 16449)
-- Name: Transactions_TransactionId_seq; Type: SEQUENCE; Schema: Budgeting; Owner: postgres
--

CREATE SEQUENCE "Budgeting"."Transactions_TransactionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "Budgeting"."Transactions_TransactionId_seq" OWNER TO postgres;

--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 226
-- Name: Transactions_TransactionId_seq; Type: SEQUENCE OWNED BY; Schema: Budgeting; Owner: postgres
--

ALTER SEQUENCE "Budgeting"."Transactions_TransactionId_seq" OWNED BY "Budgeting"."Transactions"."TransactionId";


--
-- TOC entry 223 (class 1259 OID 16432)
-- Name: account_AccountId_seq; Type: SEQUENCE; Schema: Budgeting; Owner: postgres
--

CREATE SEQUENCE "Budgeting"."account_AccountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "Budgeting"."account_AccountId_seq" OWNER TO postgres;

--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 223
-- Name: account_AccountId_seq; Type: SEQUENCE OWNED BY; Schema: Budgeting; Owner: postgres
--

ALTER SEQUENCE "Budgeting"."account_AccountId_seq" OWNED BY "Budgeting"."Accounts"."AccountId";


--
-- TOC entry 4720 (class 2604 OID 16419)
-- Name: Sessions SessionId; Type: DEFAULT; Schema: Authentication; Owner: postgres
--

ALTER TABLE ONLY "Authentication"."Sessions" ALTER COLUMN "SessionId" SET DEFAULT nextval('"Authentication".sessions_sessionid_seq'::regclass);


--
-- TOC entry 4722 (class 2604 OID 16436)
-- Name: Accounts AccountId; Type: DEFAULT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Accounts" ALTER COLUMN "AccountId" SET DEFAULT nextval('"Budgeting"."account_AccountId_seq"'::regclass);


--
-- TOC entry 4723 (class 2604 OID 16454)
-- Name: Transactions TransactionId; Type: DEFAULT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Transactions" ALTER COLUMN "TransactionId" SET DEFAULT nextval('"Budgeting"."Transactions_TransactionId_seq"'::regclass);


--
-- TOC entry 4724 (class 2604 OID 16455)
-- Name: Transactions Account; Type: DEFAULT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Transactions" ALTER COLUMN "Account" SET DEFAULT nextval('"Budgeting"."Transactions_Account_seq"'::regclass);


--
-- TOC entry 4728 (class 2606 OID 16409)
-- Name: Credentials authentication_pkey; Type: CONSTRAINT; Schema: Authentication; Owner: postgres
--

ALTER TABLE ONLY "Authentication"."Credentials"
    ADD CONSTRAINT authentication_pkey PRIMARY KEY ("Username");


--
-- TOC entry 4730 (class 2606 OID 16424)
-- Name: Sessions sessions_pkey; Type: CONSTRAINT; Schema: Authentication; Owner: postgres
--

ALTER TABLE ONLY "Authentication"."Sessions"
    ADD CONSTRAINT sessions_pkey PRIMARY KEY ("SessionId");


--
-- TOC entry 4726 (class 2606 OID 16396)
-- Name: Users users_pkey; Type: CONSTRAINT; Schema: Authentication; Owner: postgres
--

ALTER TABLE ONLY "Authentication"."Users"
    ADD CONSTRAINT users_pkey PRIMARY KEY ("Username");


--
-- TOC entry 4734 (class 2606 OID 16448)
-- Name: Categories Category_pkey; Type: CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Categories"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("Name");


--
-- TOC entry 4736 (class 2606 OID 16459)
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY ("TransactionId");


--
-- TOC entry 4732 (class 2606 OID 16438)
-- Name: Accounts account_pkey; Type: CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Accounts"
    ADD CONSTRAINT account_pkey PRIMARY KEY ("AccountId");


--
-- TOC entry 4737 (class 2606 OID 16410)
-- Name: Credentials authentication_username_fkey; Type: FK CONSTRAINT; Schema: Authentication; Owner: postgres
--

ALTER TABLE ONLY "Authentication"."Credentials"
    ADD CONSTRAINT authentication_username_fkey FOREIGN KEY ("Username") REFERENCES "Authentication"."Users"("Username");


--
-- TOC entry 4738 (class 2606 OID 16425)
-- Name: Sessions sessions_username_fkey; Type: FK CONSTRAINT; Schema: Authentication; Owner: postgres
--

ALTER TABLE ONLY "Authentication"."Sessions"
    ADD CONSTRAINT sessions_username_fkey FOREIGN KEY ("Username") REFERENCES "Authentication"."Users"("Username");


--
-- TOC entry 4740 (class 2606 OID 16460)
-- Name: Transactions Transactions_Account_fkey; Type: FK CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Transactions"
    ADD CONSTRAINT "Transactions_Account_fkey" FOREIGN KEY ("Account") REFERENCES "Budgeting"."Accounts"("AccountId");


--
-- TOC entry 4741 (class 2606 OID 16465)
-- Name: Transactions Transactions_Category_fkey; Type: FK CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Transactions"
    ADD CONSTRAINT "Transactions_Category_fkey" FOREIGN KEY ("Category") REFERENCES "Budgeting"."Categories"("Name");


--
-- TOC entry 4742 (class 2606 OID 16470)
-- Name: Transactions Transactions_CreatedBy_fkey; Type: FK CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Transactions"
    ADD CONSTRAINT "Transactions_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "Authentication"."Users"("Username");


--
-- TOC entry 4739 (class 2606 OID 16439)
-- Name: Accounts account_Owner_fkey; Type: FK CONSTRAINT; Schema: Budgeting; Owner: postgres
--

ALTER TABLE ONLY "Budgeting"."Accounts"
    ADD CONSTRAINT "account_Owner_fkey" FOREIGN KEY ("Owner") REFERENCES "Authentication"."Users"("Username");


-- Completed on 2025-01-19 20:35:08

--
-- PostgreSQL database dump complete
--

