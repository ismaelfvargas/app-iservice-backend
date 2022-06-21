import { Router } from 'express';
import { parseISO } from "date-fns";
import { getCustomRepository } from "typeorm";

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async(request, response) => {

   console.log(request.user)

   const appointmentRepository = getCustomRepository(AppointmentsRepository);
   const appointments = await appointmentRepository.find();

   return response.json(appointments);
})

appointmentsRouter.post('/', async (request, response) => {
   try {
      // const { provider, date } = request.body
      const { provider_id, date } = request.body;

      // pega uma string e transforma em data
      const parsedDate = parseISO(date);

      const createAppointment = new CreateAppointmentService();

      const appointment = await createAppointment.execute({
         date: parsedDate,
         provider_id })

      return response.json(appointment);
   } catch (err) {
      // @ts-ignore
      return response.status(400).json({ error: err.message });
   }
});

export default appointmentsRouter;