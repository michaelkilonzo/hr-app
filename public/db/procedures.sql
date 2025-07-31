CREATE OR REPLACE PROCEDURE employee_hire_sp (
  p_first_name     IN HR_EMPLOYEES.first_name%TYPE,
  p_last_name      IN HR_EMPLOYEES.last_name%TYPE,
  p_email          IN HR_EMPLOYEES.email%TYPE,
  p_salary         IN HR_EMPLOYEES.salary%TYPE,
  p_hire_date      IN HR_EMPLOYEES.hire_date%TYPE,
  p_phone          IN HR_EMPLOYEES.phone_number%TYPE,
  p_job_id         IN HR_EMPLOYEES.job_id%TYPE,
  p_manager_id     IN HR_EMPLOYEES.manager_id%TYPE,
  p_department_id  IN HR_EMPLOYEES.department_id%TYPE
)
IS
BEGIN
  INSERT INTO HR_EMPLOYEES (
    EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL,
    PHONE_NUMBER, HIRE_DATE, JOB_ID, SALARY,
    MANAGER_ID, DEPARTMENT_ID
  )
  VALUES (
    EMPLOYEES_SEQ.NEXTVAL, p_first_name, p_last_name, p_email,
    p_phone, p_hire_date, p_job_id, p_salary,
    p_manager_id, p_department_id
  );

  COMMIT;
END;
/

-- TODO: trigger on each insert/delete into HR_EMPLOYEES
DECLARE
  v_max_id NUMBER;
  v_sql    VARCHAR2(1000);
BEGIN
  SELECT NVL(MAX(employee_id), 0) + 1 INTO v_max_id FROM hr_employees;

  v_sql := 'CREATE SEQUENCE employees_seq START WITH ' || v_max_id || ' INCREMENT BY 1 NOCACHE';

  EXECUTE IMMEDIATE v_sql;
END;
/


select distinct job_id from hr_employees order by job_id;

select department_id, department_name from hr_departments;

select * from hr_jobs order by job_title;

