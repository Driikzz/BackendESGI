import meetingRepository from "../repositories/meetingRepository";
import alertesService from "../services/alertesService";
import Alertes from '../models/Alertes';
import { IEndOfYearMeeting } from '../models/EndOfYearMeeting';
import { IMidTermMeeting } from '../models/MidTermMeeting';
import { IStartOfYearMeeting } from '../models/StartOfYearMeeting';
import { AlertTypes, AlertType } from '../types/alertTypes';
import Duo from '../models/Duo';

class MeetingService {
  async createStartOfYearMeeting(data: any) {
    const meeting = await meetingRepository.createStartOfYearMeeting(data);
    await this.checkAndCreateAlert(meeting.id, data, 'START_OF_YEAR');
    return meeting;
  }

  async createMidTermMeeting(data: any) {
    const meeting = await meetingRepository.createMidTermMeeting(data);
    await this.checkAndCreateAlert(meeting.id, data, 'MID_TERM');
    return meeting;
  }

  async createEndOfYearMeeting(data: any) {
    const meeting = await meetingRepository.createEndOfYearMeeting(data);
    await this.checkAndCreateAlert(meeting.id, data, 'END_OF_YEAR');
    return meeting;
  }

  async updateStartOfYearMeeting(id: number, data: any) {
    await meetingRepository.updateStartOfYearMeeting(id, data);
    const meeting = await meetingRepository.getStartOfYearMeetingById(id);
    if (meeting) {
      await this.checkAndCreateAlert(id, data, 'START_OF_YEAR');
    }
    return meeting;
  }

  async updateMidTermMeeting(id: number, data: any) {
    await meetingRepository.updateMidTermMeeting(id, data);
    const meeting = await meetingRepository.getMidTermMeetingById(id);
    if (meeting) {
      await this.checkAndCreateAlert(id, data, 'MID_TERM');
    }
    return meeting;
  }

  async updateEndOfYearMeeting(id: number, data: any) {
    await meetingRepository.updateEndOfYearMeeting(id, data);
    const meeting = await meetingRepository.getEndOfYearMeetingById(id);
    if (meeting) {
      await this.checkAndCreateAlert(id, data, 'END_OF_YEAR');
    }
    return meeting;
  }

  async getStartOfYearMeetingById(id: number) {
    return await meetingRepository.getStartOfYearMeetingById(id);
  }

  async getMidTermMeetingById(id: number) {
    return await meetingRepository.getMidTermMeetingById(id);
  }

  async getEndOfYearMeetingById(id: number) {
    return await meetingRepository.getEndOfYearMeetingById(id);
  }

  async getStartOfYearMeetingByStudentId(studentId: string) {
    return await meetingRepository.getStartOfYearMeetingByStudentId(studentId);
  }

  async getMidTermMeetingByStudentId(studentId: string) {
    return await meetingRepository.getMidTermMeetingByStudentId(studentId);
  }

  async getEndOfYearMeetingByStudentId(studentId: string) {
    return await meetingRepository.getEndOfYearMeetingByStudentId(studentId);
  }

  async getMeetingsByUserId(studentId: string) {
    const endOfYear = await meetingRepository.getEndOfYearMeetingByStudentId(studentId);
    const midTerm = await meetingRepository.getMidTermMeetingByStudentId(studentId);
    const startOfYear = await meetingRepository.getStartOfYearMeetingByStudentId(studentId);
    return { endOfYear, midTerm, startOfYear };
  }

  private async checkAndCreateAlert(meetingId: number, formData: any, meetingType: AlertType) {
    let { studentId, duoId } = formData;

    if (!studentId || !duoId) {
      const meeting = await this.getMeetingById(meetingId, meetingType);
      if (meeting) {
        studentId = meeting.studentId;
        duoId = meeting.duoId;
      }
    }

    if (!studentId || !duoId) {
      console.error('Missing studentId or duoId in formData or from meeting data');
      return;
    }

    if (formData.recruitmentPlans) {
      await this.createOrUpdateAlert(meetingId, formData, AlertTypes.RECRUITMENT_PLANS_ALERT, studentId, duoId);
    }
    if (formData.continuationOfStudies) {
      await this.createOrUpdateAlert(meetingId, formData, AlertTypes.CONTINUATION_OF_STUDIES_ALERT, studentId, duoId);
    }
    if (formData.proactivityRating && formData.proactivityRating < 3) {
      await this.createOrUpdateAlert(meetingId, formData, AlertTypes.PROACTIVITY_ALERT, studentId, duoId);
    }
    if (formData.teamworkRating && formData.teamworkRating < 3) {
      await this.createOrUpdateAlert(meetingId, formData, AlertTypes.TEAMWORK_ALERT, studentId, duoId);
    }
  }

  private async createOrUpdateAlert(meetingId: number, formData: any, alertType: AlertType, studentId: string | number, duoId: number) {
    console.log('Checking if alert exists:', alertType, studentId);
    const existingAlerts = await alertesService.getAlertesByFormulaireId(meetingId);

    const alertExists = existingAlerts.some(alert => alert.typeAlerte === alertType);

    if (!alertExists) {
      console.log('Creating alert:', alertType, studentId);
      await Alertes.create({
        alternantId: Number(studentId), // Assurez-vous que studentId est un nombre
        duoId: duoId,
        formulaireId: meetingId,
        message: 'Une alerte a été créée en fonction des conditions remplies.',
        datedeCreation: new Date(),
        dateDeTraitement: null,
        traitantId: null,
        typeAlerte: alertType,
      });
    } else {
      console.log('Alert already exists:', alertType, studentId);
    }
  }

  private async getMeetingById(meetingId: number, meetingType: AlertType) {
    switch (meetingType) {
      case 'START_OF_YEAR':
        return await this.getStartOfYearMeetingById(meetingId);
      case 'MID_TERM':
        return await this.getMidTermMeetingById(meetingId);
      case 'END_OF_YEAR':
        return await this.getEndOfYearMeetingById(meetingId);
      default:
        throw new Error(`Unknown meeting type: ${meetingType}`);
    }
  }
}

export default new MeetingService();
