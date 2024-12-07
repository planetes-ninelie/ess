import request from '@/utils/request'
import type { } from './type'
import { GET_INFO } from '@/utils/token'

enum API {
  ADD = '/recommendation/addRecommendation',
  RESHOPS = '/recommendation/getRecommendationShops',
  REDISHS = '/recommendation/getRecommendationDishes',
  UPDATE = '/recommendation/updateRecommendation'
}

export const addRecommendation = (data: any) => {
  const createdBy = GET_INFO()
  const dto: Recommendation = {
    type: data.type,
    targetId: data.targetId,
    displayOrder: data.displayOrder,
    createdBy,
  }
  return request.post(API.ADD, dto)
}

export const getRecommendShops = () => request.get(API.RESHOPS)

export const getRecommendDish = () => request.get(API.REDISHS)

export const updateRecommendation = (data: any) => {
  const dto: Recommendation = {
    id: data.id,
    displayOrder: data.displayOrder
  }
  return request.post(API.UPDATE, dto)
}