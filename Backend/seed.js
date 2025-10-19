const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://asca360_db_user:01%40Meelas@asca360.jeqwvbc.mongodb.net/?retryWrites=true&w=majority&appName=asca360";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    required: true,
    enum: ["asca", "student", "committee", "mca-student"],
  },
  name: { type: String },
});

const User = mongoose.model("User", userSchema);

const students = [
  {
    name: "AARON GLADSTON",
    email: "TVE24MCA-2001@cet.ac.in",
    password: "9745688031",
    role: "student",
  },
  {
    name: "ABHIMANYU",
    email: "TVE24MCA-2002@cet.ac.in",
    password: "21105004269",
    role: "student",
  },
  {
    name: "ABHIN DEV A",
    email: "TVE24MCA-2003@cet.ac.in",
    password: "9846205075",
    role: "student",
  },
  {
    name: "ABHISHEK ABHAYAKUMAR",
    email: "TVE24MCA-2004@cet.ac.in",
    password: "7034365314",
    role: "student",
  },
  {
    name: "ABHISHEK R.S",
    email: "TVE24MCA-2005@cet.ac.in",
    password: "7736487600",
    role: "student",
  },
  {
    name: "ABIN VARGHESE",
    email: "TVE24MCA-2006@cet.ac.in",
    password: "9129153001",
    role: "student",
  },
  {
    name: "ABRAHAM PETER",
    email: "TVE24MCA-2007@cet.ac.in",
    password: "9778237716",
    role: "student",
  },
  {
    name: "AFRAKE",
    email: "TVE24MCA-2008@cet.ac.in",
    password: "8089326061",
    role: "student",
  },
  {
    name: "AISWARYA A",
    email: "TVE24MCA-2009@cet.ac.in",
    password: "7356160270",
    role: "student",
  },
  {
    name: "AKHIL K BABU",
    email: "TVE24MCA-2010@cet.ac.in",
    password: "8078532270",
    role: "student",
  },
  {
    name: "ALEENA ELIZABATH MANOJ",
    email: "TVE24MCA-2011@cet.ac.in",
    password: "9778552302",
    role: "student",
  },
  {
    name: "AMEGHA SHAJI",
    email: "TVE24MCA-2012@cet.ac.in",
    password: "9677927806",
    role: "student",
  },
  {
    name: "ANANDU PN",
    email: "TVE24MCA-2013@cet.ac.in",
    password: "9747977987",
    role: "student",
  },
  {
    name: "ANUPAMA G S",
    email: "TVE24MCA-2014@cet.ac.in",
    password: "9746983049",
    role: "student",
  },
  {
    name: "ARAVIND K J",
    email: "TVE24MCA-2015@cet.ac.in",
    password: "8848060367",
    role: "student",
  },
  {
    name: "ARSHA P",
    email: "TVE24MCA-2016@cet.ac.in",
    password: "9037906868",
    role: "student",
  },
  {
    name: "ARUNDHATI PRABHALD",
    email: "TVE24MCA-2017@cet.ac.in",
    password: "8848187331",
    role: "student",
  },
  {
    name: "ASWIN R S",
    email: "TVE24MCA-2018@cet.ac.in",
    password: "9074066393",
    role: "student",
  },
  {
    name: "BASIL POUL",
    email: "TVE24MCA-2019@cet.ac.in",
    password: "8848580633",
    role: "student",
  },
  {
    name: "BHARADWAJ",
    email: "TVE24MCA-2020@cet.ac.in",
    password: "7356263595",
    role: "student",
  },
  {
    name: "BHAVANA THIRUVATH",
    email: "TVE24MCA-2021@cet.ac.in",
    password: "735672836",
    role: "student",
  },
  {
    name: "CHAITHANYA K S",
    email: "TVE24MCA-2022@cet.ac.in",
    password: "7907928401",
    role: "student",
  },
  {
    name: "DEEPAK H",
    email: "TVE24MCA-2023@cet.ac.in",
    password: "8281990423",
    role: "student",
  },
  {
    name: "DEVIKRISHNA K",
    email: "TVE24MCA-2024@cet.ac.in",
    password: "9633299861",
    role: "student",
  },
  {
    name: "DIVA BIJITH JOHN",
    email: "TVE24MCA-2025@cet.ac.in",
    password: "8129699010",
    role: "student",
  },
  {
    name: "FARZAN SALEEM",
    email: "TVE24MCA-2026@cet.ac.in",
    password: "7034498752",
    role: "student",
  },
  {
    name: "GAUTHAM B",
    email: "TVE24MCA-2027@cet.ac.in",
    password: "9037078107",
    role: "student",
  },
  {
    name: "GOKUL P",
    email: "TVE24MCA-2028@cet.ac.in",
    password: "8606716951",
    role: "student",
  },
  {
    name: "HAFEEFA A P M",
    email: "TVE24MCA-2029@cet.ac.in",
    password: "7025201013",
    role: "student",
  },
  {
    name: "HAJARA B",
    email: "TVE24MCA-2030@cet.ac.in",
    password: "7356190182",
    role: "student",
  },
  {
    name: "JEFIN THOMAS PHILIP",
    email: "TVE24MCA-2031@cet.ac.in",
    password: "9656746139",
    role: "student",
  },
  {
    name: "JERARDH TOM JASPER",
    email: "TVE24MCA-2032@cet.ac.in",
    password: "7558977917",
    role: "student",
  },
  {
    name: "JOHN WILLIAM SANTHOSH",
    email: "TVE24MCA-2033@cet.ac.in",
    password: "9496209122",
    role: "student",
  },
  {
    name: "KRISHNA K G",
    email: "TVE24MCA-2034@cet.ac.in",
    password: "9037648785",
    role: "student",
  },
  {
    name: "KRISHNENDHU JILLS",
    email: "TVE24MCA-2035@cet.ac.in",
    password: "7025005045",
    role: "student",
  },
  {
    name: "K V MISRA",
    email: "TVE24MCA-2036@cet.ac.in",
    password: "7012748583",
    role: "student",
  },
  {
    name: "MEGHA P M",
    email: "TVE24MCA-2037@cet.ac.in",
    password: "9037640902",
    role: "student",
  },
  {
    name: "MISNA JEBIN K",
    email: "TVE24MCA-2038@cet.ac.in",
    password: "9048398124",
    role: "student",
  },
  {
    name: "M JAYALEKSHMI",
    email: "TVE24MCA-2039@cet.ac.in",
    password: "7736326379",
    role: "student",
  },
  {
    name: "MUHAMMED K B",
    email: "TVE24MCA-2040@cet.ac.in",
    password: "9634597245",
    role: "student",
  },
  {
    name: "NANDANA NARAYAN",
    email: "TVE24MCA-2041@cet.ac.in",
    password: "9400546558",
    role: "student",
  },
  {
    name: "NANDANA R NAIR",
    email: "TVE24MCA-2042@cet.ac.in",
    password: "9995705677",
    role: "student",
  },
  {
    name: "NANDHUSIVAN S N",
    email: "TVE24MCA-2043@cet.ac.in",
    password: "9995048493",
    role: "student",
  },
  {
    name: "NAZRIN FATHIMA RAFI",
    email: "TVE24MCA-2044@cet.ac.in",
    password: "9400970670",
    role: "student",
  },
  {
    name: "NIDAL C",
    email: "TVE24MCA-2045@cet.ac.in",
    password: "8075533641",
    role: "student",
  },
  {
    name: "PRESHITH POWEL S",
    email: "TVE24MCA-2046@cet.ac.in",
    password: "7736679568",
    role: "student",
  },
  {
    name: "PRIYA R",
    email: "TVE24MCA-2047@cet.ac.in",
    password: "9447369113",
    role: "student",
  },
  {
    name: "RAMA K",
    email: "TVE24MCA-2048@cet.ac.in",
    password: "8848614931",
    role: "student",
  },
  {
    name: "ROHIT M",
    email: "TVE24MCA-2049@cet.ac.in",
    password: "7994212522",
    role: "student",
  },
  {
    name: "SANA S NAVAS",
    email: "TVE24MCA-2050@cet.ac.in",
    password: "9778738343",
    role: "student",
  },
  {
    name: "SANDRA SHINE",
    email: "TVE24MCA-2051@cet.ac.in",
    password: "9895540657",
    role: "student",
  },
  {
    name: "SHIVARAMA",
    email: "TVE24MCA-2052@cet.ac.in",
    password: "8086942128",
    role: "student",
  },
  {
    name: "SOURAV S NAIR",
    email: "TVE24MCA-2053@cet.ac.in",
    password: "7558812768",
    role: "student",
  },
  {
    name: "SUBI SURESH",
    email: "TVE24MCA-2054@cet.ac.in",
    password: "9633978071",
    role: "student",
  },
  {
    name: "THAHIRA SHAJAHAN",
    email: "TVE24MCA-2055@cet.ac.in",
    password: "9188031152",
    role: "student",
  },
  {
    name: "THEERTHA PRAVEEN N",
    email: "TVE24MCA-2056@cet.ac.in",
    password: "7907549397",
    role: "student",
  },
  {
    name: "TINA FRANCIS",
    email: "TVE24MCA-2057@cet.ac.in",
    password: "7020377297",
    role: "student",
  },
  {
    name: "VISMAYA VINOD",
    email: "TVE24MCA-2058@cet.ac.in",
    password: "9020356120",
    role: "student",
  },
  {
    name: "YADHUKRISHNA N P",
    email: "TVE24MCA-2059@cet.ac.in",
    password: "9605654176",
    role: "student",
  },
  {
    name: "ZUHRI NOOR",
    email: "TVE24MCA-2060@cet.ac.in",
    password: "9995188555",
    role: "student",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    const emailsToDelete = students.map((s) => s.email);
    await User.deleteMany({ email: { $in: emailsToDelete } });
    console.log("Existing student data cleared.");

    await User.insertMany(students);
    console.log(
      `Successfully inserted ${students.length} students into the database.`
    );
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDatabase();
