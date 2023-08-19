import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";
import { createErrandUsecase } from "../usecases/create-errand.usecase";
import { listErrandUsecase } from "../usecases/list-errand-usecase";
import { updateErrandUsecase } from "../usecases/update-errand-usecase";
import { deleteErrandUsecase } from "../usecases/delete-errand-usecase";



export class ErrandController {
  public async createErrand(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { description, detail } = req.body;
  
      const usecase = new createErrandUsecase();
      const result = await usecase.execute({description, detail, userId});

      return res.status(StatusCodes.OK).send({
        result
      });
    
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
  
        const usecase = new listErrandUsecase();
        const result = await usecase.execute(userId);

        return res.status(StatusCodes.OK).send({
          result
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
  
        const usecase = new updateErrandUsecase();
        const result = await usecase.execute({userId, errandId, description, detail});

        return res.status(StatusCodes.OK).send({
          result
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
  
        const usecase = new deleteErrandUsecase();
        const result = await usecase.execute({userId, errandId});
        
        return res.status(StatusCodes.OK).send({
          result
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
        const errand = await errandRepository.get({ errandId });
    
        if (!errand) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
    
        if (errand.archived === false) {
          errand.archived = true;
          await errandRepository.update(errand);
        } else {
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
        const errand = await new ErrandRepository().get({
          errandId,
        });
        
        if (!errand) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
        
        if(errand._archived === true){
          errand._archived = false;
          await errandRepository.update(errand);
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

        let errands = await new ErrandRepository().list({
            userId: userId,
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
  
