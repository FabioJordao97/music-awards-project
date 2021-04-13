import { ShowDatabase } from "../data/ShowDatabase";
import { Show, ShowInputDTO, WeekDay } from "../../../music-awards-project/src/business/entities/Show";
import { UserRole } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { IdGenerator } from "./services/IdGenerator";
import { BandDatabase } from "../data/BandDatabase";

export class ShowBusiness {
  constructor(
    private showDatabase: ShowDatabase,
    private bandDatabase: BandDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) {}

  async createShow(input: ShowInputDTO, token: string) {
    const tokenData = this.authenticator.getData(token);
    const band = await this.bandDatabase.getBandById(input.band_id)
    
    if (tokenData.role !== UserRole.ADMIN) {
      throw new CustomError(401, "Only admins can access this feature");
    }

    if (
      !input.band_id ||
      !input.week_day ||
      !input.start_time ||
      !input.end_time
    ) {
      throw new CustomError(401, "Invalid input to createShow");
    }

    if (
      input.start_time < 8 ||
      input.end_time > 23 ||
      input.start_time >= input.end_time
    ) {
      throw new CustomError(401, "Invalid times to createShow");
    }

    if (
      Number.isInteger(input.start_time) ||
      Number.isInteger(input.end_time)
    ) {
      throw new CustomError(401, "Times should be integer to createShow");
    }

    if(!band) {
        throw new CustomError(404, "Band not found"); 
    }

    const registeredShows = await this.showDatabase.getShowsByTimes(
      input.week_day,
      input.start_time,
      input.end_time
    );

    if(registeredShows.length) {
        throw new CustomError(401, "No more shows can be created at this times!");
    }

    await this.showDatabase.createShow(
        Show.toShow({
            ...input,
            id: this.idGenerator.generate()
        })
    )
  }

  async getShowByDay(week_day: WeekDay){
      if(!week_day){
          throw new CustomError(401, "Invalid input to getShowByDay");
      }

      const shows = await this.showDatabase.getShowByDay(week_day)

      return { result: shows}
  }
}
