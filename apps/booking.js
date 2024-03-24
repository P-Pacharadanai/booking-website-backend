import { Router } from "express";
import { pool } from "../utils/db.js";
import dayjs from "dayjs";
import { protect } from "../middlewares/protect.js";

const bookRouter = Router();
bookRouter.use(protect);

bookRouter.get("/", async (req, res) => {
  try {
    const date = req.query.date;

    let query = "select * from booking";
    let values = [];

    if (date) {
      query = `select *
        from booking
        where extract(month from check_in_date) = extract(month from $1::date) or
        extract(month from check_out_date) = extract(month from $1::date)`;
      values = [date];
    }

    const result = await pool.query(query, values);

    return res.json({
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

bookRouter.post("/", async (req, res) => {
  try {
    const booking = {
      user_id: req.user.id,
      full_name: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      check_in_date: req.body.checkIn,
      check_out_date: req.body.checkOut,
      created_at: new Date(),
    };

    const isBeforeToday = dayjs().isAfter(booking.check_in_date, "day");

    if (isBeforeToday) {
      return res.status(400).json({
        message: "check in date must be in the future.",
      });
    }

    const result = await pool.query(
      `select *
        from booking
        where ($1 >= check_in_date AND $1 < check_out_date) OR
        (check_in_date >= $1 AND check_in_date < $2) OR
        (check_out_date > $1 AND check_out_date <= $2)`,
      [booking.check_in_date, booking.check_out_date]
    );

    if (result.rowCount !== 0) {
      return res.status(400).json({
        message: "Booking conflicts with existing reservations.",
      });
    }

    await pool.query(
      `insert into booking (user_id, full_name, email, phone,check_in_date,check_out_date,created_at)
        values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        booking.user_id,
        booking.full_name,
        booking.email,
        booking.phone,
        booking.check_in_date,
        booking.check_out_date,
        booking.created_at,
      ]
    );

    return res.json({
      message: "Reservation completed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

export default bookRouter;
