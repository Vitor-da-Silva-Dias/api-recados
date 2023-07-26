import { Request, Response } from "express";
import { Errand } from "../models/errand.model";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";



export class ErrandController {
  public async createErrand(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { description, detail } = req.body;
  
      const user = await new UserRepository().get(userId);
  
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
      }
  
  
      const errand = new Errand(description, detail, user);
      await new ErrandRepository().create(errand);
  
      const responsePayload = {
        ok: true,
        message: "Errand successfully added.",
        data: errand.toJson(),
      };
  
      return res.status(StatusCodes.OK).send(responsePayload);
    
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
  

  public async listErrand(req: Request, res: Response) {
      try {
        const { userId } = req.params;
  
        const user = await new UserRepository().get(userId);

        if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
        }

        let errands = await new ErrandRepository().list({
            userId: userId,
        });
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Errand was sucessfully listed",
          data: errands.map((errands) => errands.toJson())
        });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public async updateErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
        const { description, detail } = req.body;
  
        const user = await new UserRepository().get(userId);
        if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
        }

        const errandRepository = new ErrandRepository();
        const errand = await errandRepository.get(errandId);

        if (!errand) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "Errand was not found" }); 
        }
        
        if (description) {
            errand.description = description;
        }

        if (detail) {
            errand.detail = detail;
        }
  
        await errandRepository.update(errand);

        const errands = await errandRepository.list({
            userId,
        });
  
        return res.status(StatusCodes.OK).send({
            ok: true,
            message: "Errand was succesfully updated",
            data: errands.map((errand) => errand.toJson())
            });  
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public async deleteErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
  
        const user = await new UserRepository().get(userId);
        if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
        }

        const errandRepository = new ErrandRepository();
        const deletedErrand = await errandRepository.delete(errandId);

        if (deletedErrand == 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "Errand was not found" });
        }

        const errands = await errandRepository.list({
            userId,
        });
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Errand was deleted",
          data: errands.map((errand) => errand.toJson())
          });  
       
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public async archiveErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
    
        const user = await new UserRepository().get(userId);
        if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
        }

    
        const errandRepository = new ErrandRepository();
        const errand = await errandRepository.get(errandId);
        
        if (!errand) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
        
        if(errand._archived === false){
          errand._archived = true;
        }
        else{
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send({ ok: false, message: "Errand already archived." });
        }
    
        return res
          .status(StatusCodes.OK)
          .send({ ok: true, message: "Errand was successfully archived." });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }
    
    public async unarchiveErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
    
        const user = await new UserRepository().get(userId);
        if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
        }

    
        const errandRepository = new ErrandRepository();
        const errand = await errandRepository.get(errandId);
        
        if (!errand) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
        
        if(errand._archived === true){
          errand._archived = false;
        }
        else{
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send({ ok: false, message: "Errand already unarchived." });
        }
    
        return res
          .status(StatusCodes.OK)
          .send({ ok: true, message: "Errand was successfully unarchived." });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }
    
  public  async filterErrands(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { description, archived } = req.query;

    const user = await new UserRepository().get(userId);
        if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
        }

        const errandRepository = new ErrandRepository();
        let errands = await errandRepository.list({
            userId,
        });

    if (description) {
      const lowerCaseDescription = String(description).toLowerCase();
      errands = errands.filter(
        (errand) => errand.description.toLowerCase().includes(lowerCaseDescription)
      );
    }

    
    if (archived !== "") {
      const isArchived = archived === 'true';
      errands = errands.filter((errand) => errand._archived === isArchived);
    }

    return res.status(StatusCodes.OK).send({ ok: true, errands: errands });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      ok: false,
      message: error.toString(),
    });
  }
}
};
  
