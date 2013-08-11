require "spec_helper"

describe GamesController do
  describe "GET #dashboard" do
    it "responds successfully with an HTTP 200 status code" do
      get :dashboard
      expect(response).to be_success
      expect(response.status).to eq(200)
    end


    it "renders the dashboard template" do
      get :dashboard
      expect(response).to render_template("dashboard")
    end
  end

  describe "GET #single" do
    it "responds successfully with an HTTP 200 status code" do
      get :single
      expect(response).to be_success
      expect(response.status).to eq(200)
    end
  end

  describe "GET #multi" do
    it "responds successfully with an HTTP 200 status code" do
      get :multi
      expect(response).to be_success
      expect(response.status).to eq(200)
    end
  end
end