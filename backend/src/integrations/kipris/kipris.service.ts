import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as xml2js from 'xml2js';

@Injectable()
export class KiprisService {
    private readonly client: AxiosInstance;
    private readonly logger = new Logger(KiprisService.name);
    private readonly apiKey: string;
    private readonly isMockMode: boolean;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('KIPRIS_API_KEY') || '';
        this.isMockMode = !this.apiKey || this.apiKey === 'your-kipris-api-key';

        this.client = axios.create({
            baseURL: 'http://plus.kipris.or.kr/openapi/rest',
            timeout: 10000,
        });
    }

    async searchByApplicationNumber(applicationNumber: string): Promise<any> {
        if (this.isMockMode) {
            this.logger.log(`[MOCK] Searching KIPRIS for ${applicationNumber}`);
            return this.getMockData(applicationNumber);
        }

        try {
            const response = await this.client.get('/patUtiModInfoSearchService/getBiblioSummaryInfo', {
                params: {
                    applicationNumber: applicationNumber,
                    ServiceKey: this.apiKey,
                },
                responseType: 'text' // KIPRIS returns XML usually
            });

            return await this.parseResponse(response.data);
        } catch (error) {
            this.logger.error(`KIPRIS API Error: ${error.message}`);
            throw error;
        }
    }

    private async parseResponse(xmlData: string): Promise<any> {
        const parser = new xml2js.Parser({ explicitArray: false });
        return await parser.parseStringPromise(xmlData);
    }

    private getMockData(appNum: string) {
        // Return dummy data structure mimicking KIPRIS
        return {
            response: {
                body: {
                    items: {
                        biblioSummaryInfo: {
                            applicationNumber: appNum,
                            inventionTitle: 'Mock Invention Title from KIPRIS',
                            applicationDate: '20250101',
                            applicantName: 'Mock Applicant',
                            registerStatus: 'Registered',
                            registerDate: '20250601',
                        }
                    }
                }
            }
        };
    }
}
