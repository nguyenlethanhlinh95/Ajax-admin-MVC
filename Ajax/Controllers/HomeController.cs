using Ajax.Models;
using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Ajax.Controllers
{
    public class HomeController : Controller
    {
        ModelDataContext db = new ModelDataContext();
        #region list Employess
        List<EmployeeModel> listEmployee = new List<EmployeeModel>()
        {
            new EmployeeModel()
            {
                Id = 1,
                Name = "Linh",
                Salary = 20000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 2,
                Name = "Nam",
                Salary = 10000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 3,
                Name = "Long",
                Salary = 30000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 4,
                Name = "linh4",
                Salary = 30000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 5,
                Name = "Linh5",
                Salary = 30000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 6,
                Name = "Linh6",
                Salary = 30000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 7,
                Name = "Linh7",
                Salary = 30000,
                Status = true
            },
            new EmployeeModel()
            {
                Id = 8,
                Name = "Linh8",
                Salary = 30000,
                Status = true
            }
        #endregion
        
        };
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public JsonResult LoadData(string name, string status,int page, int pageSize=3)
        {
            /*var model = db.Employees.OrderByDescending(x=>x.CreateDate).Skip((page - 1) * pageSize).Take(pageSize);*/ // lay ban ghi
            IQueryable<Employee> model = db.Employees;

            //Kiem tra name khac rong
            if (!string.IsNullOrEmpty(name))
            {
                model = model.Where(x => x.Name.Contains(name));
            }
            if (!string.IsNullOrEmpty(status))
            {
                var statusBool = bool.Parse(status);
                model = model.Where(x => x.Status == statusBool);
            }
            int totalRow = model.Count(); //dem tong ban ghi
            model = model.OrderByDescending(x => x.CreateDate).Skip((page - 1) * pageSize).Take(pageSize);

            /*int totalRow = db.Employees.Count();*/  //dem tong ban ghi
            return Json(new
            {
                data = model,
                total = totalRow,
                status = true
            },JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDetail(int id)
        {
            var employee = new Employee();
            var message = string.Empty;
            bool status = false;
            try
            {
                employee = db.Employees.Find(id);
                status = true;
            }
            catch(Exception ex)
            {
                message = ex.Message;
            }
            return Json(new
            {
                data = employee,
                status = status,
                message = message
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(string model)
        {
            bool status = false;
            //Ep kieu model string sang doi tuong
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Employee employee = serializer.Deserialize<Employee>(model);

            //Lay ra employee can cap nhat
            var entity = db.Employees.Find(employee.ID);

            entity.Salary = employee.Salary;
            try
            {
                db.SaveChanges();
                status = true;
            }
            catch
            {
                status = false;
            }
            
            return Json(new
            {
                status = status,
            });
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            bool status = false;

            var entity = db.Employees.Find(id);

            db.Employees.Remove(entity);           
            try
            {
                db.SaveChanges();
                return Json(new
                {
                    status = true,
                });
            }
            catch(Exception ex)
            {
                return Json(new
                {
                    status = true,
                    message = ex.Message
                });
            }

            
        }

        [HttpPost]
        public JsonResult SaveData(string model)
        {
            //Ep kieu model string sang doi tuong
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Employee employee = serializer.Deserialize<Employee>(model);

            bool status = false;
            string message = string.Empty;
            //Neu id bang 0 thi se them moi
            if (employee.ID == 0)
            {
                employee.CreateDate = DateTime.Now;
                db.Employees.Add(employee);               
                try
                {
                    db.SaveChanges();
                    status = true;
                }
                catch (Exception e)
                {
                    status = false;
                    message = e.Message;
                }
            }
            else //se cap nhat
            {
                var entity = db.Employees.Find(employee.ID);
                entity.Salary = employee.Salary;
                entity.Status = employee.Status;
                entity.Name = employee.Name;
                try
                {
                    db.SaveChanges();
                    status = true;
                }
                catch (Exception e)
                {
                    status = false;
                    message = e.Message;
                }
                
                
            }

            //Lay ra employee can cap nhat
            //var entity = listEmployee.Single(x => x.Id == employee.Id);

            //entity.Salary = employee.Salary;

            return Json(new
            {
                status = true,
                message = message
            });
        }
    }
}