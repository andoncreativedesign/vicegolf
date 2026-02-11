import type { AddressFragment } from 'customer-accountapi.generated';
import { PencilIcon, TrashIcon } from 'lucide-react'

interface AddressCardProps {
  address: Pick<
    AddressFragment,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'company'
    | 'address1'
    | 'address2'
    | 'city'
    | 'zoneCode'
    | 'zip'
    | 'territoryCode'
    | 'phoneNumber'
  >;
  isDefault?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  isEditing?: boolean;
  isRemoving?: boolean;
  className?: string;
};

const baseCardClasses =
  'relative px-0 py-0 text-gray-900';

export function AddressCard({
  address,
  isDefault = false,
  onEdit,
  onRemove,
  isEditing = false,
  isRemoving = false,
  className,
}: AddressCardProps) {
  const {
    firstName,
    lastName,
    company,
    address1,
    address2,
    city,
    zoneCode,
    zip,
    territoryCode,
    phoneNumber,
  } = address;

  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const cityLine = [zip, city, zoneCode].filter(Boolean).join(' ');

  const addressLines = [
    company || undefined,
    address1 || undefined,
    address2 || undefined,
    cityLine || undefined,
    territoryCode || undefined,
    phoneNumber || undefined,
  ].filter(Boolean) as string[];

  return (
    <article className={className ? `${baseCardClasses} ${className}` : baseCardClasses}>
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Badge + Address Details */}
        <div className="flex flex-col gap-3">
          {isDefault && (
            <span className="self-start inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Default
            </span>
          )}

          <div className="text-gray-900">
            {fullName && (
              <p className="font-bold text-base mb-1">{fullName}</p>
            )}
            <div className="text-sm leading-relaxed text-gray-800 font-medium">
              {addressLines.map((line, index) => (
                <p key={`${address.id}-${index}`}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Actions Stacked */}
        <div className="flex flex-col gap-3 mt-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              disabled={isEditing}
              className="inline-flex items-center justify-end gap-2 text-sm text-gray-600 transition hover:text-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PencilIcon className="h-4 w-4" />
              <span className="font-medium">{isEditing ? 'Editing…' : 'Edit'}</span>
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={isRemoving}
              className="inline-flex items-center justify-end gap-2 text-sm text-gray-600 transition hover:text-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="font-medium">{isRemoving ? 'Removing…' : 'Remove'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

