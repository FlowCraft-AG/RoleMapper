/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import type { PipelineStage } from 'mongoose';

/**
 * Erstellt eine Aggregationspipeline, um Funktionen und Benutzer mit einer
 * verbleibenden Zeit (`timeLeft`) innerhalb des angegebenen `lookaheadPeriod` zu finden.
 *
 * @param {Date} now - Das aktuelle Datum.
 * @param {Date} lookaheadDate - Das Enddatum basierend auf `lookaheadPeriod`.
 * @returns {PipelineStage[]} Die Aggregationspipeline.
 */
export function retiringUsersPipeline(now: Date, lookaheadDate: Date): PipelineStage[] {
    return [
        {
            $lookup: {
                from: 'HKA_Users', // Verknüpft mit der Benutzer-Sammlung
                localField: 'users', // Benutzer-IDs aus Mandates
                foreignField: 'userId', // Benutzer-IDs aus HKA_Users
                as: 'userDetails', // Füge die Benutzer-Details hinzu
            },
        },
        {
            $unwind: '$userDetails', // Entpackt die Benutzer-Details
        },
        {
            $match: {
                'userDetails.validUntil': {
                    $lte: lookaheadDate, // Benutzer mit `validUntil` innerhalb des Zeitraums
                },
            },
        },
        {
            $project: {
                _id: 0,
                function: {
                    _id: '$_id', // ID der Funktion
                    functionName: '$functionName', // Name der Funktion
                    orgUnit: '$orgUnit', // Organisationseinheit
                    isSingleUser: '$isSingleUser', // Einzelbenutzer-Funktion
                },
                userList: {
                    userId: '$userDetails.userId', // Benutzer-ID
                    timeLeft: {
                        $divide: [
                            { $subtract: ['$userDetails.validUntil', now] }, // Verbleibende Zeit in Millisekunden
                            1000 * 60 * 60 * 24, // Umrechnung in Tage
                        ],
                    },
                },
            },
        },
        {
            $group: {
                _id: '$function', // Gruppiere nach Funktion
                function: { $first: '$function' },
                userList: { $push: '$userList' }, // Liste der Benutzer mit verbleibender Zeit
            },
        },
    ];
}
