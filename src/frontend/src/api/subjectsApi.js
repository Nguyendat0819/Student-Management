import axiosClient from "./axiosclient";

export const getSubject = () => {
    return axiosClient.get('/api/optionSubject');
}
export const deleteGrade = (id) => {
    return axiosClient.delete(`/api/deleteGrades/${id}`);
}