import { RemoteCustomLabel } from '../models/remote-custom-label';
import { DateService } from '../../date-service';
import { CustomLabel } from '../../../years/services/custom-labels/custom-label';

export class CustomLabelMapper {
    public static mapBackToFront(source: RemoteCustomLabel): CustomLabel {
        return {
            date: new Date(source.date),
            label: source.label ?? '',
            tag: source.tag ?? '',
            color: source.color ?? '',
            style: source.style ?? ''
        } as CustomLabel;
    }

    public static mapListBackToFront(sources: RemoteCustomLabel[]): CustomLabel[] {
        return sources.map(s => CustomLabelMapper.mapBackToFront(s));

    }

    public static mapFrontToBack(source: CustomLabel): RemoteCustomLabel {
        const target = {
            date: DateService.formatDate(source.date),
            label: source.label,
            tag: source.tag,
            color: source.color,
            style: source.style,
        } as RemoteCustomLabel;

        return target;
    }

    public static mapListFrontToBack(sources: CustomLabel[]): RemoteCustomLabel[] {
        return sources.map(s => CustomLabelMapper.mapFrontToBack(s));

    }
}