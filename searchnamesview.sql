CREATE VIEW searchnames (id , full_name , full_name_reverse, birth_date, document_type, document_number, familiar_id) AS
    SELECT 
        Persons.id AS id,
        CONCAT(name, " ", surname),
        CONCAT(surname, " ", name),
        birth_date,
        document_type,
        document_number,
        NULL
    FROM
        Persons 
    UNION SELECT 
        referent_family_member_id,
        CONCAT(name, " ", surname),
        CONCAT(surname, " ", name),
        birth_date,
        document_type,
        document_number,
        id
    FROM
        familymembers