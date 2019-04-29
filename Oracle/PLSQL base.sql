-- AFFICHER UNE VARIABLE
DECLARE
NAME VARCHAR2(100);
BEGIN
	NAME := 'RICO';  --AFFECTATION D'UNE VALEUR A UN VARIABLE
	DBMS_OUTPUT.PUT_LINE('HEY ' || NAME);  -- UTILISER UN CONCATENATION PUIS AFFICHER LA VALEUR
END;


-- UTILISATION DES CONDITIONS IF ELSE END

DECLARE
VALUE NUMBER := 100;
BEGIN
	IF VALUE > 50   ---  ON PEUT UTILISER OR OU AND ICI
	THEN
		DBMS_OUTPUT.PUT_LINE('NUMBER ' || VALUE || ' SUPPERIEUR A 50');
	ELSE
		DBMS_OUTPUT.PUT_LINE('NUMBER ' || VALUE || ' INFERIEUR A 50');
	END IF;
END;

--- CASE SYNTAX
CASE employee_type
	WHEN 'S' THEN
		award_salary_bonus(employee_id);
	WHEN 'H' THEN
		award_hourly_bonus(employee_id);
	WHEN 'C' THEN
		award_commissioned_bonus(employee_id);
	ELSE
		RAISE invalid_employee_type;
END CASE;


--EXEMPLE DE CASE

DECLARE
	salary NUMBER := 20000;
	employee_id NUMBER := 36325;
	PROCEDURE give_bonus (emp_id IN NUMBER, bonus_amt IN NUMBER) IS
BEGIN
	DBMS_OUTPUT.PUT_LINE(emp_id);
	DBMS_OUTPUT.PUT_LINE(bonus_amt);
END;
BEGIN
	give_bonus(employee_id,
		CASE
			WHEN salary >= 10000 AND salary <= 20000 THEN 1500
			WHEN salary > 20000 AND salary <= 40000 THEN 1000
			WHEN salary > 40000 THEN 500
			ELSE 0
		END
	);
END;

---lE STATEMENT STATEMENT
BEGIN
	GOTO second_output;
	DBMS_OUTPUT.PUT_LINE('This line will never execute.');
	<<second_output>>
	DBMS_OUTPUT.PUT_LINE('We are here!');
END;

---SIMPLE LOOP

PROCEDURE display_multiple_years (
	start_year_in IN PLS_INTEGER
	,end_year_in IN PLS_INTEGER
)
IS
	l_current_year PLS_INTEGER := start_year_in;
BEGIN
	LOOP
		EXIT WHEN l_current_year > end_year_in;
		display_total_sales (l_current_year);
		l_current_year := l_current_year + 1;
	END LOOP;
END display_multiple_years;

---FOR LOOP

/* File on web: loop_examples.sql */
PROCEDURE display_multiple_years (
start_year_in IN PLS_INTEGER
,end_year_in IN PLS_INTEGER
)
IS
BEGIN
	FOR l_current_year IN start_year_in .. end_year_in
	LOOP
		display_total_sales(l_current_year);
	END LOOP;
END display_multiple_years;

--- for loop

/* File on web: loop_examples.sql */
PROCEDURE display_multiple_years (
start_year_in IN PLS_INTEGER
,end_year_in IN PLS_INTEGER
)
IS
BEGIN
	FOR sales_rec IN (
		SELECT *
		FROM sales_data
		WHERE year BETWEEN start_year_in AND end_year_in
	)
	LOOP
		display_total_sales(sales_rec.year);
	END LOOP;
END display_multiple_years;

--- FOR NUMERIC LOOP

FOR loop_counter IN 1 .. 10
LOOP
... executable statements ...
END LOOP;

--- FOR NUMERIC LOOP

FOR loop_counter IN REVERSE 1 .. 10
LOOP
... executable statements ...
END LOOP;


--Autonomous Transaction
-----------------------------------
PROCEDURE update_salary (dept_in IN NUMBER)
	IS
	PRAGMA AUTONOMOUS_TRANSACTION;
	CURSOR myemps IS
	SELECT empno FROM emp
	WHERE deptno = dept_in
	FOR UPDATE NOWAIT;
BEGIN
FOR rec IN myemps
LOOP
UPDATE emp SET sal = sal * 2
WHERE empno = rec.empno;
END LOOP;
COMMIT;
END;
BEGIN
UPDATE emp SET sal = sal * 2;
update_salary (10);
END;
