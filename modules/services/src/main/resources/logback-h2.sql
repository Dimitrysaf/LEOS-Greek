-- Tables for logging framework --

-- Sequence for event_id
CREATE SEQUENCE IF NOT EXISTS logging_event_id_seq START WITH 1 INCREMENT BY 1;

-- Main logging table
CREATE TABLE IF NOT EXISTS logging_event
(
    event_id          BIGINT DEFAULT NEXT VALUE FOR logging_event_id_seq PRIMARY KEY,
    timestmp          BIGINT        NOT NULL,
    formatted_message CLOB          NOT NULL,
    logger_name       VARCHAR2(254) NOT NULL,
    level_string      VARCHAR2(254) NOT NULL,
    thread_name       VARCHAR2(254),
    reference_flag    SMALLINT,
    arg0              VARCHAR2(254),
    arg1              VARCHAR2(254),
    arg2              VARCHAR2(254),
    arg3              VARCHAR2(254),
    caller_filename   VARCHAR2(254),
    caller_class      VARCHAR2(254),
    caller_method     VARCHAR2(254),
    caller_line       VARCHAR2(8)
);

-- MDC properties
CREATE TABLE IF NOT EXISTS logging_event_property
(
    event_id     BIGINT        NOT NULL,
    mapped_key   VARCHAR2(254) NOT NULL,
    mapped_value CLOB,
    PRIMARY KEY (event_id, mapped_key),
    FOREIGN KEY (event_id) REFERENCES logging_event (event_id)
);

-- Stack traces
CREATE TABLE IF NOT EXISTS logging_event_exception
(
    event_id   BIGINT         NOT NULL,
    i          SMALLINT       NOT NULL,
    trace_line VARCHAR2(4000) NOT NULL,
    PRIMARY KEY (event_id, i),
    FOREIGN KEY (event_id) REFERENCES logging_event (event_id)
);
