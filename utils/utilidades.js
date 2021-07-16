/* Comprueba que la cuenta a la que se quiera transferir pertenezca al usuario que ha iniciado sesion */
const checkAccountBeforeTransfer = async (model, userID, requestID) => {
   try {
      const accounts = await model.findMany({
         where: { id_usuario: userID },
         select: { id: true },
      });

      const accountsIDs = accounts.map((el) => el.id);

      if (accountsIDs.includes(+requestID)) return true;
      return false;
   } catch (e) {
      console.log(e);
   }
};

module.exports = { checkAccountBeforeTransfer };
