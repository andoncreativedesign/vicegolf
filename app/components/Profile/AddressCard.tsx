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
  } = address;

  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const cityLine = [zip, city, zoneCode].filter(Boolean).join(' ');

  const addressLines = [
    fullName || undefined,
    company || undefined,
    address1 || undefined,
    address2 || undefined,
    cityLine || undefined,
    territoryCode || undefined,
  ].filter(Boolean) as string[];

  return (
    <article className={className ? `${baseCardClasses} ${className}` : baseCardClasses}>
      <div className="flex items-start justify-between gap-4">
        {isDefault && (
          <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Default
          </span>
        )}

        <div className="ml-auto flex items-center gap-3 font-medium text-gray-700">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              disabled={isEditing}
              className="inline-flex items-center gap-1 text-gray-700 transition hover:text-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PencilIcon className="h-4 w-4" />
              {isEditing ? 'Editing…' : 'Edit'}
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={isRemoving}
              className="inline-flex items-center gap-1 text-gray-700 transition hover:text-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
              {isRemoving ? 'Removing…' : 'Remove'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-gray-800 leading-relaxed font-semibold">
        {addressLines.map((line, index) => (
          <p
            style={{ marginBottom: index === addressLines.length - 1 ? '0' : '0.5rem' }}
            key={`${address.id}-${index}`}
          >
            {line}
          </p>
        ))}
      </div>
    </article>
  );
}

