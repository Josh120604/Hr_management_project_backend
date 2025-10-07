CREATE DATABASE hr_data;
USE hr_data;
-- EMPLOYEES AND DEPARTMENTS
CREATE TABLE department (
    department_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL UNIQUE, 
    hourly_rate DECIMAL(10,1) NOT NULL
) AUTO_INCREMENT=101;

INSERT INTO department (department_name,hourly_rate)
VALUES	('Development','437.5'),
		('HR','533.4'),
		('QA','323.5'),
		('Sales','364.0'),
		('Marketing','358.5'),
		('Design','387.0'),
		('IT','411.4'),
		('Finance','400.0'),
		('Support','360.0');

CREATE TABLE EmployeeData (
    emp_id VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL, -- Changed to VARCHAR
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    position VARCHAR(255),
    reviewer_emp_id VARCHAR(20) NULL, -- Changed to VARCHAR to match emp_id type
    CONSTRAINT FK_EmployeeData_Department FOREIGN KEY (department_id) REFERENCES Department(department_id)
);
-- Insert into employee_data with new EMP-xxx IDs
INSERT INTO EmployeeData (emp_id, name, department_id, position, reviewer_emp_id)
VALUES
    ('EMP-700', 'Sibongile Nkosi', 101, 'Software Engineer', 'EMP-700'),
    ('EMP-701', 'Lungile Moyo', 102, 'HR Manager', 'EMP-701'),
    ('EMP-702', 'Thabo Molefe', 103, 'Quality Analyst', 'EMP-702'),
    ('EMP-703', 'Keshav Naidoo', 104, 'Sales Representative', NULL),
    ('EMP-704', 'Zanele Khumalo', 105, 'Marketing Specialist', NULL),
    ('EMP-705', 'Sipho Zulu', 106, 'UI/UX Designer', NULL),
    ('EMP-706', 'Naledi Moeketsi', 107, 'DevOps Engineer', NULL),
    ('EMP-707', 'Farai Gumbo', 105, 'Content Strategist', NULL),
    ('EMP-708', 'Karabo Dlamini', 108, 'Accountant', NULL),
    ('EMP-709', 'Fatima Patel', 109, 'Customer Support Lead', 'EMP-709');
    

-- New table for dedicated department reviewers
CREATE TABLE Reviewers (
    reviewer_emp_id VARCHAR(20) PRIMARY KEY,
    emp_id VARCHAR(20) UNIQUE NOT NULL, -- Changed to VARCHAR
    department_id INT UNIQUE NOT NULL,
    CONSTRAINT FK_Reviewers_EmployeeData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id),
    CONSTRAINT FK_Reviewers_Department FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

INSERT INTO Reviewers (reviewer_emp_id, emp_id, department_id)
VALUES
    ('EMP-701', 'EMP-701', 102), -- Lungile Moyo
    ('EMP-700', 'EMP-700', 101), -- Sibongile Nkosi
    ('EMP-702', 'EMP-702', 103), -- Thabo Molefe
    ('EMP-709', 'EMP-709', 109); -- Fatima Patel

CREATE TABLE Contact (
    emp_id VARCHAR(20) PRIMARY KEY NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    CONSTRAINT FK_Contact_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

INSERT INTO Contact (emp_id, email, phone_number)
VALUES
    ('EMP-700', 'sibongile.nkosi@moderntech.com', '+27821234567'),
    ('EMP-701', 'lungile.moyo@moderntech.com', '+27837654321'),
    ('EMP-702', 'thabo.molefe@moderntech.com', '+27719876543'),
    ('EMP-703', 'keshav.naidoo@moderntech.com', '+27601122334'),
    ('EMP-704', 'zanele.khumalo@moderntech.com', '+27725566778'),
    ('EMP-705', 'sipho.zulu@moderntech.com', '+27843322110'),
    ('EMP-706', 'naledi.moeketsi@moderntech.com', '+27618765432'),
    ('EMP-707', 'farai.gumbo@moderntech.com', '+27762345678'),
    ('EMP-708', 'karabo.dlamini@moderntech.com', '+27814567890'),
    ('EMP-709', 'fatima.patel@moderntech.com', '+27639876543');


CREATE TABLE Address (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(20) UNIQUE NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    country VARCHAR(100) NOT NULL,
    CONSTRAINT FK_Address_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

INSERT INTO Address (emp_id, street_address, city, state_province, postal_code, country)
VALUES
    ('EMP-700', '15 Waterfall Ave', 'Cape Town', 'Western Cape', '8001', 'South Africa'),
    ('EMP-701', '22 Rose Street', 'Johannesburg', 'Gauteng', '2001', 'South Africa'),
    ('EMP-702', '5 Durban Road', 'Durban', 'KwaZulu-Natal', '4001', 'South Africa'),
    ('EMP-703', '7 Sandton Drive', 'Sandton', 'Gauteng', '2196', 'South Africa'),
    ('EMP-704', '10 Sea Point Main Rd', 'Cape Town', 'Western Cape', '8005', 'South Africa'),
    ('EMP-705', '3 Pretoria Street', 'Pretoria', 'Gauteng', '0001', 'South Africa'),
    ('EMP-706', '8 Umhlanga Rocks Dr', 'Umhlanga', 'KwaZulu-Natal', '4319', 'South Africa'),
    ('EMP-707', '12 Woodstock Exchange', 'Cape Town', 'Western Cape', '7925', 'South Africa'),
    ('EMP-708', '4 Rivonia Road', 'Johannesburg', 'Gauteng', '2128', 'South Africa'),
    ('EMP-709', '9 Greenpoint Ave', 'Cape Town', 'Western Cape', '8001', 'South Africa');
    
CREATE TABLE EmpHistory (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR
    start_date DATE NOT NULL,
    end_date DATE NULL,
    department_id INT NOT NULL,
    CONSTRAINT FK_EmpHistory_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id),
    CONSTRAINT FK_EmpHistory_Department FOREIGN KEY (department_id) REFERENCES Department(department_id),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

INSERT INTO EmpHistory (emp_id, start_date, end_date, department_id)
VALUES
    ('EMP-700', '2015-01-01', '2018-12-31', 101),
    ('EMP-700', '2019-01-01', NULL, 101),
    ('EMP-701', '2013-01-01', '2017-12-31', 102),
    ('EMP-701', '2018-01-01', NULL, 102),
    ('EMP-702', '2018-01-01', NULL, 103),
    ('EMP-703', '2020-01-01', NULL, 104),
    ('EMP-704', '2019-01-01', NULL, 105),
    ('EMP-705', '2016-01-01', NULL, 106),
    ('EMP-706', '2017-01-01', NULL, 107),
    ('EMP-707', '2021-01-01', NULL, 105),
    ('EMP-708', '2018-01-01', NULL, 108),
    ('EMP-709', '2016-01-01', NULL, 109);



CREATE TABLE Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR
    reviewer_emp_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR
    department_id INT NOT NULL,
    review_date DATE NOT NULL,
    review_text TEXT NULL,
    rating INT DEFAULT 1,
    CONSTRAINT FK_Reviews_ReviewedEmp FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id),
    CONSTRAINT FK_Reviews_ReviewerEmp FOREIGN KEY (reviewer_emp_id) REFERENCES EmployeeData(emp_id),
    UNIQUE (emp_id, reviewer_emp_id, review_date)
);
INSERT INTO Reviews (emp_id, reviewer_emp_id, department_id, review_date, review_text, rating)
VALUES
    ('EMP-700', 'EMP-701', '101', '2025-06-15', 'Excellent performance, consistently exceeds expectations.', 5),
    ('EMP-702', 'EMP-701', '102', '2025-06-16', 'Good progress, areas for improvement in communication.', 4),
    ('EMP-703', 'EMP-701', '103', '2025-06-17', 'Met all sales targets, strong team player.', 4), 
    ('EMP-704', 'EMP-701', '104', '2025-06-18', 'Creative and innovative, needs to improve project deadlines.', 3),
    ('EMP-705', 'EMP-700', '105', '2025-06-19', 'Strong design skills, very reliable.', 4),
    ('EMP-706', 'EMP-700', '106', '2025-06-20', 'Technical expert, could improve documentation.', 4),
    ('EMP-707', 'EMP-700', '107', '2025-06-21', 'Achieved all content goals, proactive in new initiatives.', 5),
    ('EMP-708', 'EMP-700', '105', '2025-06-22', 'Detail-oriented and accurate, good with financial reporting.', 4),
    ('EMP-709', 'EMP-700', '108', '2025-06-23', 'Exceptional customer service, natural leader.', 5),
    ('EMP-702', 'EMP-701', '109', '2024-12-01', 'Mid-year check-in, showing good development.', 4);

-- PAYMENT AND ATTENDANCE
CREATE TABLE Attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(20) NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status VARCHAR(50) NOT NULL DEFAULT 'Not Clocked in', -- 'Clocked in', 'Not Clocked in', 'On Leave'
    clocked_in_time TIME NULL, -- New column for specific clock-in time
    attendance_state VARCHAR(50) NOT NULL DEFAULT 'Absent', -- 'Present', 'Late', 'Absent', 'Leave'
    CONSTRAINT FK_Attendance_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

-- Insert data into the Attendance table with updated logic
INSERT INTO Attendance (emp_id, attendance_date, attendance_status, clocked_in_time, attendance_state)
VALUES
    -- EMP-700
    ('EMP-700', '2025-07-25', 'Clocked in', '08:30:00', 'Present'),
    ('EMP-700', '2025-07-26', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-700', '2025-07-27', 'Clocked in', '09:10:00', 'Late'),
    ('EMP-700', '2025-07-28', 'Clocked in', '08:45:00', 'Present'),
    ('EMP-700', '2025-07-29', 'Clocked in', '08:55:00', 'Present'),

    -- EMP-701
    ('EMP-701', '2025-07-25', 'Clocked in', '08:35:00', 'Present'),
    ('EMP-701', '2025-07-26', 'Clocked in', '08:40:00', 'Present'),
    ('EMP-701', '2025-07-27', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-701', '2025-07-28', 'Clocked in', '09:05:00', 'Late'),
    ('EMP-701', '2025-07-29', 'Clocked in', '08:50:00', 'Present'),

    -- EMP-702
    ('EMP-702', '2025-07-25', 'Clocked in', '08:45:00', 'Present'),
    ('EMP-702', '2025-07-26', 'Clocked in', '08:50:00', 'Present'),
    ('EMP-702', '2025-07-27', 'Clocked in', '09:10:00', 'Late'),
    ('EMP-702', '2025-07-28', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-702', '2025-07-29', 'Clocked in', '08:30:00', 'Present'),

    -- EMP-703
    ('EMP-703', '2025-07-25', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-703', '2025-07-26', 'Clocked in', '08:55:00', 'Present'),
    ('EMP-703', '2025-07-27', 'Clocked in', '09:00:00', 'Present'), -- Exactly 9 AM, considered Present
    ('EMP-703', '2025-07-28', 'Clocked in', '08:30:00', 'Present'),
    ('EMP-703', '2025-07-29', 'Clocked in', '09:05:00', 'Late'),

    -- EMP-704
    ('EMP-704', '2025-07-25', 'Clocked in', '08:40:00', 'Present'),
    ('EMP-704', '2025-07-26', 'Clocked in', '08:45:00', 'Present'),
    ('EMP-704', '2025-07-27', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-704', '2025-07-28', 'Clocked in', '09:15:00', 'Late'),
    ('EMP-704', '2025-07-29', 'Clocked in', '08:50:00', 'Present'),

    -- EMP-705
    ('EMP-705', '2025-07-25', 'Clocked in', '08:30:00', 'Present'),
    ('EMP-705', '2025-07-26', 'Clocked in', '08:35:00', 'Present'),
    ('EMP-705', '2025-07-27', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-705', '2025-07-28', 'Clocked in', '09:20:00', 'Late'),
    ('EMP-705', '2025-07-29', 'Clocked in', '08:55:00', 'Present'),

    -- EMP-706
    ('EMP-706', '2025-07-25', 'Clocked in', '08:45:00', 'Present'),
    ('EMP-706', '2025-07-26', 'Clocked in', '08:50:00', 'Present'),
    ('EMP-706', '2025-07-27', 'Clocked in', '09:05:00', 'Late'),
    ('EMP-706', '2025-07-28', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-706', '2025-07-29', 'Clocked in', '08:30:00', 'Present'),

    -- EMP-707
    ('EMP-707', '2025-07-25', 'Clocked in', '08:35:00', 'Present'),
    ('EMP-707', '2025-07-26', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-707', '2025-07-27', 'Clocked in', '09:10:00', 'Late'),
    ('EMP-707', '2025-07-28', 'Clocked in', '08:40:00', 'Present'),
    ('EMP-707', '2025-07-29', 'Clocked in', '08:50:00', 'Present'),

    -- EMP-708
    ('EMP-708', '2025-07-25', 'Clocked in', '08:50:00', 'Present'),
    ('EMP-708', '2025-07-26', 'Clocked in', '08:55:00', 'Present'),
    ('EMP-708', '2025-07-27', 'Clocked in', '09:15:00', 'Late'),
    ('EMP-708', '2025-07-28', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-708', '2025-07-29', 'Clocked in', '08:40:00', 'Present'),

    -- EMP-709
    ('EMP-709', '2025-07-25', 'Clocked in', '08:40:00', 'Present'),
    ('EMP-709', '2025-07-26', 'Clocked in', '08:45:00', 'Present'),
    ('EMP-709', '2025-07-27', 'Not Clocked in', NULL, 'Absent'),
    ('EMP-709', '2025-07-28', 'Clocked in', '09:05:00', 'Late'),
    ('EMP-709', '2025-07-29', 'Clocked in', '08:50:00', 'Present');

CREATE TABLE LeaveTable (
    leave_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR
    leave_start DATE NOT NULL,
    leave_reason VARCHAR(255) DEFAULT 'Not Given',
    leave_end DATE NULL,
    leave_status VARCHAR(50) NOT NULL,
    CHECK (leave_start IS NULL OR leave_end IS NULL OR leave_start <= leave_end),
    CONSTRAINT FK_Leave_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

INSERT INTO LeaveTable (emp_id, leave_start, leave_reason, leave_end, leave_status)
VALUES
    ('EMP-700', '2025-07-22', 'Sick Leave', '2025-07-22', 'Approved'),
    ('EMP-700', '2024-12-01', 'Personal', '2024-12-01', 'Pending'),
    ('EMP-701', '2025-07-15', 'Family Responsibility', '2025-07-15', 'Denied'),
    ('EMP-701', '2024-12-02', 'Vacation', '2024-12-02', 'Approved'),
    ('EMP-702', '2025-07-10', 'Medical Appointment', '2025-07-10', 'Approved'),
    ('EMP-702', '2024-12-05', 'Personal', '2024-12-05', 'Pending'),
    ('EMP-703', '2025-07-20', 'Bereavement', '2025-07-20', 'Approved'),
    ('EMP-704', '2024-12-01', 'Childcare', '2024-12-01', 'Pending'),
    ('EMP-705', '2025-07-18', 'Sick Leave', '2025-07-18', 'Approved'),
    ('EMP-706', '2025-07-22', 'Vacation', '2025-07-22', 'Pending'),
    ('EMP-707', '2024-12-02', 'Medical Appointment', '2024-12-02', 'Approved'),
    ('EMP-708', '2025-07-19', 'Childcare', '2025-07-19', 'Denied'),
    ('EMP-709', '2024-12-03', 'Vacation', '2024-12-03', 'Pending');

CREATE TABLE Salary (
    emp_id VARCHAR(20), -- Changed to VARCHAR
    effective_date DATE,
    department_id INT NOT NULL,
    hours_worked INT NOT NULL,
    deductions DECIMAL(10,2) NOT NULL,
    base_salary DECIMAL(10, 2) NOT NULL,
    final_salary DECIMAL(10, 2),
    PRIMARY KEY (emp_id, effective_date),
    CONSTRAINT FK_Salary_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id),
    CONSTRAINT FK_Salary_Department FOREIGN KEY (department_id) REFERENCES department(department_id)
);

INSERT INTO Salary (emp_id, effective_date, department_id, hours_worked, deductions, base_salary, final_salary)
VALUES
    ('EMP-700', '2025-07-31', 101, 160, 240.00, 70000.00, 69760.00),
    ('EMP-701', '2025-07-31', 102, 150, 300.00, 80010.00, 79710.00),
    ('EMP-702', '2025-07-31', 103, 170, 120.00, 54995.00, 54875.00),
    ('EMP-703', '2025-07-31', 104, 165, 180.00, 60060.00, 59880.00),
    ('EMP-704', '2025-07-31', 105, 158, 150.00, 56643.00, 56493.00),
    ('EMP-705', '2025-07-31', 106, 168, 60.00, 65016.00, 64956.00),
    ('EMP-706', '2025-07-31', 107, 175, 90.00, 71995.00, 71905.00),
    ('EMP-707', '2025-07-31', 105, 160, 0.00, 57360.00, 57360.00),
    ('EMP-708', '2025-07-31', 108, 155, 150.00, 62000.00, 61850.00),
    ('EMP-709', '2025-07-31', 109, 162, 120.00, 58320.00, 58200.00);

CREATE TABLE EmployeeBankInfo (
    bank_account_number VARCHAR(50) PRIMARY KEY,
    emp_id VARCHAR(20) UNIQUE NOT NULL, -- Changed to VARCHAR
    bank_name VARCHAR(100) NOT NULL,
    CONSTRAINT FK_BankInfo_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

INSERT INTO EmployeeBankInfo (bank_account_number, emp_id, bank_name)
VALUES
    ('10010010010', 'EMP-700', 'FNB'),
    ('20020020020', 'EMP-701', 'Standard Bank'),
    ('30030030030', 'EMP-702', 'Absa'),
    ('40040040040', 'EMP-703', 'Nedbank'),
    ('50050050050', 'EMP-704', 'Capitec Bank'),
    ('60060060060', 'EMP-705', 'Investec'),
    ('70070070070', 'EMP-706', 'African Bank'),
    ('80080080080', 'EMP-707', 'FNB'),
    ('90090090090', 'EMP-708', 'Standard Bank'),
	('11111111111', 'EMP-709', 'Absa');

CREATE TABLE EmployeeTax (
    tax_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(20) UNIQUE NOT NULL, -- Changed to VARCHAR
    tax_code VARCHAR(50) NOT NULL,
    CONSTRAINT FK_EmployeeTax_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

INSERT INTO EmployeeTax (emp_id, tax_code)
VALUES
    ('EMP-700', 'TAXB1234567'),
    ('EMP-701', 'TAXC2345678'),
    ('EMP-702', 'TAXD3456789'),
    ('EMP-703', 'TAXE4567890'),
    ('EMP-704', 'TAXF5678901'),
    ('EMP-705', 'TAXG6789012'),
    ('EMP-706', 'TAXH7890123'),
    ('EMP-707', 'TAXI8901234'),
    ('EMP-708', 'TAXJ9012345'),
    ('EMP-709', 'TAXK0123456');

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  emp_id VARCHAR(20) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  CONSTRAINT FK_users_EmpData FOREIGN KEY (emp_id) REFERENCES EmployeeData(emp_id)
);

