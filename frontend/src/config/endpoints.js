export const endpoint = {
  login: "/user/login",
  signup: "/user/register",
  existsUser: "/user/isUserId-abailable",
  google_auth: "/user/oauth/google",
  facebook_auth: "/user/oauth/facebook",
  forgot_password: "/user/recover-password-req",
  reset_password: "/user/password-reset",
  create_order: "/order",
  // queston
  add_question: "/category/add-question",
  update_question: "/category/update-question",
  delete_question: "/category/delete-question",
  questions_suggestion: "/category/question-suggetions",
  // category
  create_category: "/category/create",
  update_category: "/category/update",
  get_category: "/category/list",
  delete_category: "/category/delete",
  category_question_serialize: "/category/update-question-sequence",

  // subcategory
  create_subcategory: "/subcategory/create",
  fetch_all_subcategory: "/subcategory/list-with-category",
  delete_subcategory: "/subcategory/delete",
  name_subcategory_update: "/subcategory/update",
  add_question_subcategory: "/subcategory/add-question",
  add_document: "/subcategory/add-document",
  update_document: "/subcategory/update-document",
  delete_document: "/subcategory/delete-document",
  // lawyer section for client
  client_list: "/request/list",
  add_client: "/request/create",
  delete_client: "/request/delete",
  update_client_status: "/request/update-status",
  send_notification: "/request/send-doc-reminder",
  update_remainder: "/request/update-reminder",

  // draft
  add_draft: "/request/add-draft",
  delete_draft: "/request/delete-draft",
  draft_list: "/request/draft-list",
  //client
  single_request: "/request/single/",
  file_upload: "/request/upload",
  request_submit: "/request/accpet",
  add_ques_on_req: "/request/add-question",
  add_doc_on_req: "/request/add-document",
  update_basic_ques: "request/update-questions",
  add_ques_ans: "request/add-question-answer",
  add_doc_upload: "request/add-document-answer",
  alter_list: "request/alert-list",
  add_comment: "request/add-comment",
  edit_comment: "request/edit-comment",
  delete_comment: "request/delete-comment",

  all_users: "/user/all",
  invitation_data: "/order/invitation",
  // file_upload: "/file/upload",
  update_order_by_seller: "/order/update-order/",
  resend_link: "/order/resend-link",

  // Subscriptions
  subscriptions: "/subscription/",
  payment_methods_list: "/subscription/payment-method/list",
  payment_method_delete: "/subscription/payment-method",
  checkout_session: "/subscription//checkout-session",
  payment_methods_create: "/subscription/payment-method/create",
  invoice_list: "/subscription/invoice/list",
};

export const adminendpoint = {
  admin_register: "/user/admin-register",
  all_seller: "/admin/all-seller",
  all_order: "/order",
  seller_delete: "/admin/seller/",
  seller_info: "/user/",
  update_permission: "/admin/update-seller",
  order_by_seller: "/order?seller=",
  seller_passwordchange: "/admin/change-password",
  business_hour_add: "/user/businesshour",
};
