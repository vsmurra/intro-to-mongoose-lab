const Customer = require('./models/customer');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB!")
    runCRM();
  })
  .catch((err) => console.log("MongoDB connection error:", err));

const prompt = require('prompt-sync')();

async function runCRM() {
  let running = true;

  while (running) {
    console.log("\nWelcome to the CRM Boutique\n");

    console.log("What would you like to do?");
    console.log("  1. Create a customer");
    console.log("  2. View all customers");
    console.log("  3. Update a customer");
    console.log("  4. Delete a customer");
    console.log("  5. Quit");

    const choice = prompt("Number of action to run: ");

    switch (choice) {
      case '1':
        const name = prompt("Enter the customer's name: ");
        const age = parseInt(prompt("Enter the customer's age: "), 10);

        const newCustomer = new Customer({ name, age });

        try {
          await newCustomer.save();
          console.log(`Customer ${name} added!`);
          
        } catch (err) {
          console.log("Error creating customer:", err);
        }
        break;

        case '2':
            try {
              const customers = await Customer.find();
          
              if (customers.length === 0) {
                console.log("No customers found.");
              } else {
                console.log("\nList of customers:\n");
                customers.forEach((cust) => {
                  console.log(`id: ${cust._id} -- Name: ${cust.name}, Age: ${cust.age}`);
                });
              }
            } catch (err) {
              console.log("Error retrieving customers:", err);
            }
            break;
          

            case '3':
                try {
                  const customers = await Customer.find();
              
                  if (customers.length === 0) {
                    console.log("No customers to update.");
                    break;
                  }
              
                  console.log("\nBelow is a list of customers:\n");
                  customers.forEach((cust) => {
                    console.log(`id: ${cust._id} -- Name: ${cust.name}, Age: ${cust.age}`);
                  });
              
                  const idToUpdate = prompt("Paste the id of the customer to update: ");
                  const newName = prompt("Enter the new name: ");
                  const newAge = parseInt(prompt("Enter the new age: "), 10);
              
                  const result = await Customer.findByIdAndUpdate(idToUpdate, {
                    name: newName,
                    age: newAge,
                  }, { new: true });
              
                  if (result) {
                    console.log("Customer updated successfully!");
                  } else {
                    console.log("Customer not found.");
                  }
                } catch (err) {
                  console.log("Error updating customer:", err);
                }
                break;
              

                case '4':
                    try {
                      const customers = await Customer.find();
                  
                      if (customers.length === 0) {
                        console.log("No customers to delete.");
                        break;
                      }
                  
                      console.log("\nHere are your customers:\n");
                      customers.forEach((cust) => {
                        console.log(`id: ${cust._id} -- Name: ${cust.name}, Age: ${cust.age}`);
                      });
                  
                      const idToDelete = prompt("Paste the id of the customer to delete: ");
                      const result = await Customer.findByIdAndDelete(idToDelete);
                  
                      if (result) {
                        console.log("Customer deleted successfully!");
                      } else {
                        console.log("Customer not found.");
                      }
                    } catch (err) {
                      console.log("Error deleting customer:", err);
                    }
                    break;
                  

      case '5':
        console.log("Exiting the CRM Boutique. See you next time!");
        await mongoose.connection.close();
        running = false;
        break;

      case 'q':
        process.exit();
        break;

      default:
        console.log("Invalid choice. Please enter a number from 1 to 5.");
    }
  }
}