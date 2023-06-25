import { users } from "../data/users";
import { Request, Response } from "express";
import { Errand } from "../models/errand";
import { StatusCodes } from "http-status-codes";



export class ErrandController {
  public createErrand(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { description, detail } = req.body;
  
      const user = users.find((user) => user.id === userId);
  
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ ok: false, message: "User was not found" });
      }
  
      if (!description) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          ok: false,
          message: "Description was not provided",
        });
      }
  
      if (!detail) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          ok: false,
          message: "Detail was not provided",
        });
      }
  
      const newErrand = new Errand(description, detail);
      user.errands?.push(newErrand);
  
      const responsePayload = {
        ok: true,
        message: "Errand successfully added.",
        data: newErrand.toJson(),
      };
  
      return res.status(StatusCodes.OK).send(responsePayload);
    
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
  

    public listErrand(req: Request, res: Response) {
      try {
        const { userId } = req.params;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found" });
        }
  
        const errands = user.errands.map((errands) =>
        errands.toJson()
      );
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Errand was sucessfully listed",
          data: errands
        });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public updateErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
        const { description, detail } = req.body;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found" });
        }
  
        const ErrandIndex = user.errands.find(
          (errand) => errand.idErrand === errandId
        );
  
        if (!ErrandIndex) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
  
        if ( !description || !detail ) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .send({ ok: false, message: "Errand is invalid" });
        }
  
        ErrandIndex.description = description;
        ErrandIndex.detail = detail;
  
        return res
          .status(StatusCodes.CREATED)
          .send({ ok: true, message: "Errand was successfully updated" });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public deleteErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found." });
        }
  
        const ErrandIndex = user.errands.findIndex(
          (errand) => errand.idErrand === errandId
        );
          
        if (ErrandIndex === -1) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
        
        
        const deletedErrand = user.errands.splice(ErrandIndex, 1);
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Errand was deleted",
          data: deletedErrand[0].toJson(),
          });  
       
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public archiveErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
    
        const user = users.find((user) => user.id === userId);
    
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found." });
        }
    
        const errand = user.errands.find((errand) => errand.idErrand === errandId);
    
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
    
    public unarchiveErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
    
        const user = users.find((user) => user.id === userId);
    
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found." });
        }
    
        const errand = user.errands.find((errand) => errand.idErrand === errandId);
    
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
    
  public filterErrands(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { description, archived } = req.query;

    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ok: false, message: 'User was not found.' });
    }

    let filteredErrands = user.errands;

    if (description) {
      const lowerCaseDescription = String(description).toLowerCase();
      filteredErrands = filteredErrands.filter(
        (errand) => errand.description.toLowerCase().includes(lowerCaseDescription)
      );
    }

    
    if (archived !== "") {
      const isArchived = archived === 'true';
      filteredErrands = filteredErrands.filter((errand) => errand._archived === isArchived);
    }

    return res.status(StatusCodes.OK).send({ ok: true, errands: filteredErrands });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      ok: false,
      message: error.toString(),
    });
  }
}
};
  
