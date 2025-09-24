import { v4 as uuidv4} from 'uuid';

export class UuidGenUtil {
    static gen () {
        return uuidv4()
    }
}