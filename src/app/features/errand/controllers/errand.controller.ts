import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createErrandUsecase } from "../usecases/create-errand.usecase";
import { listErrandUsecase } from "../usecases/list-errand-usecase";
import { updateErrandUsecase } from "../usecases/update-errand-usecase";
import { deleteErrandUsecase } from "../usecases/delete-errand-usecase";
import { archiveErrandUsecase } from "../usecases/archive-errand-usecase";
import { unarchiveErrandUsecase } from "../usecases/unarchive-errand-usecase";



export class ErrandController {
  public async createErrand(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { description, detail } = req.body;
  
      const usecase = new createErrandUsecase();
      const result = await usecase.execute({description, detail, userId});

      return res.status(result.code).send(
        result
      );
    
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

        return res.status(result.code).send(
          result
        );
      
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

        return res.status(result.code).send(
          result
        );

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
        
        return res.status(result.code).send(
          result
        );
       
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
    
        const usecase = new archiveErrandUsecase();
        const result = await usecase.execute({userId, errandId});

        return res.status(result.code).send(
          result
        );

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
    
        const usecase = new unarchiveErrandUsecase();
        const result = await usecase.execute({userId, errandId});

        return res.status(result.code).send(
          result
        );
    
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }
    
}