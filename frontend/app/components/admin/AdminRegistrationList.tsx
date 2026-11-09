"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight, FiEdit2, FiRefreshCw, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { AppDispatch, RootState } from "../../store/store";
import { deleteAdminRegistration, fetchAdminRegistration, fetchAdminRegistrations } from "../../redux/registrationAdminSlice";
import useAdminModal from "../contexts/AdminModalContext";
import AdminRegistrationEditModal from "./AdminRegistrationEditModal";
import {
  AdminRegistrationKind,
  AdminRegistrationRow,
  filterRegistrationRows,
  getRegistrationSources,
  registrationConfigs
} from "@/lib/adminRegistrations";
import * as S from "@/assets/css/Style.styles";

export default function AdminRegistrationList({kind}: {kind: AdminRegistrationKind}) {
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal, openConfirmModal} = useAdminModal();
  const {rows, status, failedSources} = useSelector((state: RootState) => state.registrationAdmin[kind]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [editingRow, setEditingRow] = useState<AdminRegistrationRow | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const busyRef = useRef(false);
  const id = useId();
  const config = registrationConfigs[kind];
  const sources = getRegistrationSources(kind);
  const isLoading = status === "idle" || status === "loading";
  const filteredRows = useMemo(() => filterRegistrationRows(rows, query, category), [rows, query, category]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / 10));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((currentPage - 1) * 10, currentPage * 10);
  const allFailed = failedSources.length === sources.length;

  const handleEdit = async (row: AdminRegistrationRow) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusyKey(row.key);
    const result = await dispatch(fetchAdminRegistration({kind, row}));
    busyRef.current = false;
    setBusyKey(null);
    if (fetchAdminRegistration.fulfilled.match(result)) {
      setEditingRow(result.payload);
    } else {
      openAlertModal(result.payload || "수정할 정보를 불러오지 못했습니다.", undefined, {variant: "error"});
    };
  };

  const handleDelete = (row: AdminRegistrationRow) => {
    if (busyRef.current) return;
    openConfirmModal(
      `"${row.cells[0]}" 항목을 삭제하시겠습니까?`,
      async () => {
        if (busyRef.current) return;
        busyRef.current = true;
        setBusyKey(row.key);
        const result = await dispatch(deleteAdminRegistration({kind, row}));
        busyRef.current = false;
        setBusyKey(null);
        if (deleteAdminRegistration.fulfilled.match(result)) {
          openAlertModal("삭제가 완료되었습니다.", undefined, {variant: "success"});
        } else {
          openAlertModal(result.payload || "삭제하지 못했습니다. 다시 시도해 주세요.", undefined, {variant: "error"});
        };
      },
      {confirmText: "예", cancelText: "아니오", description: "삭제한 항목은 복구할 수 없습니다."}
    );
  };

  return (
    <S.AdminListPanel aria-labelledby={`${id}-title`} aria-busy={isLoading}>
      <S.AdminListHeader>
        <div>
          <S.AdminSettingCardTitle id={`${id}-title`}>{config.title}</S.AdminSettingCardTitle>
          <S.AdminListCount aria-live="polite">
            {isLoading
              ? "목록을 불러오는 중입니다."
              : `검색 결과 ${filteredRows.length.toLocaleString("ko-KR")}건 / 조회된 전체 ${rows.length.toLocaleString("ko-KR")}건`}
          </S.AdminListCount>
        </div>
        <S.AdminListRefresh
        type="button"
        disabled={isLoading || busyKey !== null}
        onClick={() => {
          setPage(1);
          dispatch(fetchAdminRegistrations(kind));
        }}>
          <FiRefreshCw aria-hidden="true"/>
          새로고침
        </S.AdminListRefresh>
      </S.AdminListHeader>
      <S.AdminListToolbar>
        <S.AdminListSearch role="search" aria-label={`${config.title} 검색`}>
          <S.AdminListSearchLabel htmlFor={`${id}-search`}>등록 목록 검색</S.AdminListSearchLabel>
          <FiSearch aria-hidden="true"/>
          <S.AdminListInput
          id={`${id}-search`}
          type="search"
          placeholder={config.placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}/>
        </S.AdminListSearch>
        {kind === "integrate" && (
          <S.AdminListFilter
          aria-label="게시물 유형 필터"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}>
            <option value="">전체 유형</option>
            {sources.map(({key, label}) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </S.AdminListFilter>
        )}
        {(query || category) && (
          <S.AdminListClear
          type="button"
          onClick={() => {
            setQuery("");
            setCategory("");
            setPage(1);
          }}>
            <FiX aria-hidden="true"/>
            검색 초기화
          </S.AdminListClear>
        )}
      </S.AdminListToolbar>
      {!isLoading && failedSources.length > 0 && (
        <S.AdminListError role="alert">
          {failedSources.join(", ")} 목록을 불러오지 못했습니다.{" "}
          {allFailed ? "새로고침을 눌러 다시 시도해 주세요." : "조회된 유형의 항목만 표시합니다."}
        </S.AdminListError>
      )}
      <S.AdminListTableScroll>
        <S.AdminListTable aria-label={config.title}>
          <colgroup>
            <S.AdminListPrimaryColumn/>
            <S.AdminListDetailColumn/>
            <S.AdminListActionColumn/>
            <S.AdminListActionColumn/>
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{config.columns[0]}</th>
              <th scope="col">상세 정보</th>
              <th scope="col">수정</th>
              <th scope="col">삭제</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || !visibleRows.length ? (
              <tr>
                <S.AdminListEmpty colSpan={4}>
                  {isLoading
                    ? "등록 목록을 불러오는 중입니다."
                    : allFailed
                      ? "목록을 불러오지 못했습니다."
                      : query || category
                        ? "검색 결과가 없습니다."
                        : "아직 등록된 항목이 없습니다."}
                </S.AdminListEmpty>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.key}>
                  <td>{row.cells[0]}</td>
                  <td>
                    <S.AdminListDetails>
                      {row.cells.slice(1).map((cell, index) => (
                        <S.AdminListDetail key={config.columns[index + 1]}>
                          <dt>{config.columns[index + 1]}</dt>
                          <dd>{cell}</dd>
                        </S.AdminListDetail>
                      ))}
                    </S.AdminListDetails>
                  </td>
                  <td>
                    <S.AdminListActionButton
                    type="button"
                    aria-label={`${row.cells[0]} 수정`}
                    disabled={busyKey !== null}
                    onClick={() => handleEdit(row)}>
                      <FiEdit2 aria-hidden="true"/>
                      수정
                    </S.AdminListActionButton>
                  </td>
                  <td>
                    <S.AdminListActionButton
                    type="button"
                    aria-label={`${row.cells[0]} 삭제`}
                    $danger
                    disabled={busyKey !== null}
                    onClick={() => handleDelete(row)}>
                      <FiTrash2 aria-hidden="true"/>
                      삭제
                    </S.AdminListActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </S.AdminListTable>
      </S.AdminListTableScroll>
      <S.AdminListPagination aria-label={`${config.title} 페이지`}>
        <S.AdminListPageButton
        type="button"
        aria-label="이전 페이지"
        disabled={isLoading || currentPage === 1}
        onClick={() => setPage(currentPage - 1)}>
          <FiChevronLeft aria-hidden="true"/>
        </S.AdminListPageButton>
        <span aria-live="polite">
          {currentPage} / {totalPages}
        </span>
        <S.AdminListPageButton
        type="button"
        aria-label="다음 페이지"
        disabled={isLoading || currentPage === totalPages}
        onClick={() => setPage(currentPage + 1)}>
          <FiChevronRight aria-hidden="true"/>
        </S.AdminListPageButton>
      </S.AdminListPagination>
      {editingRow && (
        <AdminRegistrationEditModal key={editingRow.key} kind={kind} row={editingRow} onClose={() => setEditingRow(null)}/>
      )}
    </S.AdminListPanel>
  );
};
