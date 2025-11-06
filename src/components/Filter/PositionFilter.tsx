import { useEffect, useState } from 'react';
import type {
  JobFilter,
  RoleMapType,
  RoleSelectionMap,
} from '../../@types/job';

interface Props {
  Filters: JobFilter;
  ROLE_MAP: RoleMapType;
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function PositionFilter({ Filters, ROLE_MAP, onFilterChange }: Props) {
  const [isRoleFilterClicked, setIsRoleFilterClicked] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<RoleSelectionMap>(() => {
    const initial: RoleSelectionMap = Object.fromEntries(
      Object.entries(ROLE_MAP).map(([categoryKey, categoryValue]) => [
        categoryKey,
        {
          name: categoryValue.name,
          roles: Object.fromEntries(
            Object.keys(categoryValue.roles).map((roleKey) => [roleKey, true])
          ) as Record<keyof typeof categoryValue.roles, boolean>,
        },
      ])
    ) as RoleSelectionMap;
    return initial;
  });

  useEffect(() => {
    const activeRoles = Filters.roles;

    const synced: RoleSelectionMap = Object.fromEntries(
      Object.entries(ROLE_MAP).map(([categoryKey, categoryValue]) => {
        const rolesBool = Object.fromEntries(
          Object.keys(categoryValue.roles).map((roleKey) => [
            roleKey,
            activeRoles ? activeRoles.includes(roleKey) : true,
          ])
        ) as Record<keyof typeof categoryValue.roles, boolean>;

        return [
          categoryKey,
          {
            name: categoryValue.name,
            roles: rolesBool,
          },
        ];
      })
    ) as RoleSelectionMap;

    setSelectedRoles(synced);
  }, [Filters.roles, ROLE_MAP]);

  const handleApply = () => {
    const selectedRoleKeys = Object.values(selectedRoles).flatMap((category) =>
      Object.entries(category.roles)
        .filter(([_, isSelected]) => isSelected)
        .map(([roleKey, _]) => roleKey)
    );

      onFilterChange({
        ...Filters,          // 기존 필터 유지
        roles: selectedRoleKeys,
        page: undefined,     // 선택적으로 페이지 초기화
      });
    };

  return (
    <>
      <div onClick={() => setIsRoleFilterClicked(!isRoleFilterClicked)}>직군 필터</div>
      {isRoleFilterClicked && (
        <div>
          {Object.entries(ROLE_MAP).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h4>{category.name}</h4>
              {Object.entries(category.roles).map(([roleKey, roleValue]) => (
                <label key={roleKey}>
                  <input
                    type="checkbox"
                    value={roleKey}
                    checked={
                      !!selectedRoles?.[categoryKey as keyof RoleSelectionMap]?.roles?.[roleKey as string]
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setSelectedRoles((prev) => {
                        const categoryId = categoryKey as keyof RoleSelectionMap;
                        const roleId = roleKey as keyof typeof category.roles;

                        // 이전 카테고리 상태 복사
                        const prevCategory = prev[categoryId];

                        // 새로운 roles 객체 생성 (immutability 유지)
                        const updatedRoles = {
                          ...prevCategory.roles,
                          [roleId]: checked,
                        };

                        // 전체 state 반환
                        return {
                          ...prev,
                          [categoryId]: {
                            ...prevCategory,
                            roles: updatedRoles,
                          },
                        };
                      });
                    }}
                  />
                  {roleValue}
                </label>
              ))}
            </div>
          ))}
          <button onClick={() => setSelectedRoles(() => {
            const reset: RoleSelectionMap = Object.fromEntries(
              Object.entries(ROLE_MAP).map(([categoryKey, categoryValue]) => [
                categoryKey,
                {
                  name: categoryValue.name,
                  roles: Object.fromEntries(
                    Object.keys(categoryValue.roles).map((roleKey) => [roleKey, false])
                  ) as Record<keyof typeof categoryValue.roles, boolean>,
                },
              ])
            )as RoleSelectionMap;
            return reset;
          })}>초기화</button>
          <button onClick={handleApply}>적용</button>
        </div>
      )}
    </>
  );
}