import { Request, Response } from "express";
import { Show, ShowInputDTO } from "../business/entities/Show";
import { Authenticator } from "../business/services/Authenticator";
import { IdGenerator } from "../business/services/IdGenerator";
import { ShowBusiness } from "../business/ShowBusiness";
import { BandDatabase } from "../data/BandDatabase";
import { ShowDatabase } from "../data/ShowDatabase";

export class ShowController {


  async createShow (req: Request, res: Response){
    try {
      const week_day = Show.toWeekDayEnum(req.body.week_day);
      const input: ShowInputDTO = {
        band_id: req.body.band_id,
        week_day,
        start_time: req.body.start_time,
        end_time: req.body.end_time
      }

      const showBusiness = new ShowBusiness(
        new ShowDatabase,
        new BandDatabase,
        new IdGenerator,
        new Authenticator
      )

      await showBusiness.createShow(input, req.headers.authorization as string)

    

      res.status(200).send({message: "Show created!"})

    } catch (error) {
     res.status(error.statusCode || 400).send(error.message);
    
      
    }

  }

  async getShowByDay(req: Request, res: Response){
    try {

      const weekDay = Show.toWeekDayEnum(req.query.week_day as string)

      const showBusiness = new ShowBusiness(
          new ShowDatabase(),
          new BandDatabase(),
          new IdGenerator(),
          new Authenticator()
        );

      const shows = await showBusiness.getShowByDay(weekDay)

      res.status(200).send({shows})

    } catch (error) {
      res.status(error.statusCode || 400).send(error.message);
    }
  }
}
