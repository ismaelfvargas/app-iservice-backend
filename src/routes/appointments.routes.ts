import { Router } from 'express';
import { parseISO } from "date-fns";

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";
import { getCustomRepository } from "typeorm";

const appointmentsRouter = Router();


appointmentsRouter.get('/', async(request, response) => {
   const appointmentRepository = getCustomRepository(AppointmentsRepository);
   const appointments = await appointmentRepository.find();

   return response.json(appointments);
})

appointmentsRouter.post('/', async (request, response) => {
   try {
      // const { provider, date } = request.body
      const { provider, date } = request.body;

      // pega uma string e transforma em data
      const parsedDate = parseISO(date);

      const createAppointment = new CreateAppointmentService();

      const appointment = await createAppointment.execute({
         date: parsedDate,
         provider })

      return response.json(appointment);
   } catch (err) {
      // @ts-ignore
      return response.status(400).json({ error: err.message });
   }
});

export default appointmentsRouter;