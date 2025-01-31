import { Router } from "express";
import { create_event, delete_event, getEventsByDate, get_events, udpate_event } from "../controllers/eventController.js";

const router = Router()

router.get('/events', get_events)

router.post('/events', create_event)

router.put('/events', udpate_event)

router.delete('/events', delete_event)

export default router