const filterUpdates = (updates, allowedUpdates) => {
   let updatesObject = {};

   Object.keys(updates).forEach((el) => {
      if (allowedUpdates.includes(el)) {
         updatesObject[el] = updates[el];
      }
   });

   return updatesObject;
};

module.exports = { filterUpdates };
