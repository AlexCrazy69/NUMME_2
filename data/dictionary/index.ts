import { DictionaryEntry } from '../../types';
import { dictionaryA } from './a';
import { dictionaryB } from './b';
import { dictionaryC } from './c';
import { dictionaryD } from './d';
import { dictionaryE } from './e';
import { dictionaryF } from './f';
import { dictionaryG } from './g';
import { dictionaryH } from './h';
import { dictionaryI } from './i';
import { dictionaryJ } from './j';
import { dictionaryK } from './k';
import { dictionaryL } from './l';
import { dictionaryM } from './m';
import { dictionaryN } from './n';
import { dictionaryO } from './o';
import { dictionaryP } from './p';
import { dictionaryQ } from './q';
import { dictionaryR } from './r';
import { dictionaryS } from './s';
import { dictionaryT } from './t';
import { dictionaryU } from './u';
import { dictionaryV } from './v';
import { dictionaryW } from './w';
import { dictionaryX } from './x';
import { dictionaryY } from './y';
import { dictionaryZ } from './z';

const allEntries = [
    ...dictionaryA, ...dictionaryB, ...dictionaryC, ...dictionaryD,
    ...dictionaryE, ...dictionaryF, ...dictionaryG, ...dictionaryH,
    ...dictionaryI, ...dictionaryJ, ...dictionaryK, ...dictionaryL,
    ...dictionaryM, ...dictionaryN, ...dictionaryO, ...dictionaryP,
    ...dictionaryQ, ...dictionaryR, ...dictionaryS, ...dictionaryT,
    ...dictionaryU, ...dictionaryV, ...dictionaryW, ...dictionaryX,
    ...dictionaryY, ...dictionaryZ
];

export const fullDictionary: DictionaryEntry[] = [...allEntries].sort((a, b) => a.numee.localeCompare(b.numee, 'fr', { sensitivity: 'base' }));
