import { Request, Response } from 'express';
import duoService from '../services/duoService';

class DuoController {
    async createDuo(req: Request, res: Response) {
        console.log(req.body)
        try {
            const duo = await duoService.createDuo(req.body);
            res.status(201).json(duo);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    async getAllDuos(req: Request, res: Response) {
        try {
            const duos = await duoService.getAllDuos();
            res.status(200).json(duos);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    async getDuoById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const duo = await duoService.getDuoById(id);
            if (duo) {
                res.status(200).json(duo);
            } else {
                res.status(404).json({ error: 'Duo not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    async updateDuo(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const duo = await duoService.updateDuo(id, req.body);
            if (duo) {
                res.status(200).json(duo);
            } else {
                res.status(404).json({ error: 'Duo not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    async deleteDuo(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await duoService.deleteDuo(id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Duo not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}

export default new DuoController();
