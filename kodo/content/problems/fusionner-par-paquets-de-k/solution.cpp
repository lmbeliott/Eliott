#include <iostream>
#include <vector>
#include <queue>
#include <functional>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    priority_queue<long long, vector<long long>, greater<long long>> tas;   // le plus petit en haut
    for (int i = 0; i < n; i++) {
        long long taille;
        cin >> taille;
        tas.push(taille);
    }

    // chaque fusion de K tas en enlève K - 1 : on ajoute des tas vides
    // pour que toutes les fusions puissent prendre exactement K tas
    while ((tas.size() - 1) % (k - 1) != 0) tas.push(0);

    long long cout_total = 0;
    while (tas.size() > 1) {
        long long nouveau = 0;
        for (int i = 0; i < k; i++) {
            nouveau += tas.top();    // les K plus petits tas
            tas.pop();
        }
        cout_total += nouveau;
        tas.push(nouveau);
    }
    cout << cout_total << "\n";
    return 0;
}
