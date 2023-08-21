const express = require("express");
const  doctorModel =require("../model/doctor.model")
const doctorRouter = express.Router();
const { authentication } = require("../middleware/auth.middleware");
doctorRouter.get("/",authentication, async (req, res) => {
  const query={};
  try {
    const doctors=await doctorModel.find(query);
    res.send(doctors);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong..Check Again" });
  }
});

doctorRouter.post("/add",authentication, async (req, res) => {
  const payload = req.body;
  try {
    const newDoctor = new doctorModel(payload);
    await newDoctor.save();
    res.send("Doctor created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong..Check Again" });
  }
});

doctorRouter.get("/:id",authentication, async (req, res) => {
  try {
    const {id} =req.params;
    const doctors = await doctorModel.findById(id);
    if (!doctors) {
      res.status(404).send({ message:"doctors not found"});
    } else {
      res.send({doctors});
    }
  } catch(error) {
    console.log(error.message);
    res.status(500).send({message:"Something went wrong"});
  }
});

doctorRouter.patch("/update/:id",authentication, async (req, res) => {
  const {id}=req.params;
  const payload=req.body;
  try {
    const doctors=await doctorModel.findById(id);
    const doctorID_in_post=doctors.userID;
    const doctorID_in_req =req.body.userID;
    if (doctorID_in_post!==doctorID_in_req) {
      res.status(401).send({ message:"You are not authorized to proceed doctorID" });
    } else {
      await doctorModel.findByIdAndUpdate(id, payload);
      res.send("Updated post successfully");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message:"Something went wrong" });
  }
});

doctorRouter.delete("/delete/:id",authentication, async (req, res) => {
  const {id} = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    const doctorID_in_post =doctor.userID;
    const doctorID_in_req =req.body.userID;
    if (doctorID_in_post!==doctorID_in_req) {
      res.status(401).send({ message: "You are not authorized to proceed" });
    } else {
      await doctorModel.findByIdAndDelete(id);
      res.send("Deleted post successfully");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Something went wrong" });
  }
});

doctorRouter.get("/filter", async (req, res) => {
  try {
    const query = req.query.value;
    const store = query.toLowerCase();
    const filterData = await doctorModel.find({ Specialization: store });
    res.json(filterData);
  } catch (error) {
    res.status(500).json({ message: "something goes wrong", error: error.message });
  }
});

doctorRouter.get("/sort",async(req,res)=>{
  try {
    const query = req.query.value;
    if(query=="asc"){
      let sortData=await doctorModel.find().sort({date:1})
      res.json(sortData)
      
    }else if(query=="desc"){
      let sortData=await doctorModel.find().sort({date:-1})
      res.json(sortData)
    }
  } catch (error) {
    res.status(500).json({ message: "something goes wrong", error: error.message });
  }
})


doctorRouter.get("/search",async(req,res)=>{
  try {
    const query = req.query.value;
    const store = query.toLowerCase();
    console.log(query,store);

   let searchData=await doctorModel.find({name:store})
   res.json(searchData)
  } catch (error) {
    res.status(500).json({ message: "something goes wrong", error: error.message });
  }
})
module.exports = {
  doctorRouter,
};
