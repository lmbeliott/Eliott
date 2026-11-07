#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> gains, pertes;
    for (int i = 0; i < n; i++) {
        long long r, g;
        cin >> r >> g;
        if (g >= 0) gains.push_back({r, g});
        else pertes.push_back({r, g});
    }

    // d'abord les tâches qui rapportent, de la moins exigeante à la plus exigeante,
    // puis celles qui coûtent, par énergie restante r + g décroissante
    sort(gains.begin(), gains.end());
    stable_sort(pertes.begin(), pertes.end(), [](const pair<long long, long long>& a,
                                                 const pair<long long, long long>& b) {
        return a.first + a.second > b.first + b.second;
    });

    long long besoin = 0;      // énergie de départ minimale pour les tâches déjà placées
    long long variation = 0;   // changement d'énergie total depuis le départ
    for (auto& t : gains) {
        besoin = max(besoin, t.first - variation);
        variation += t.second;
    }
    for (auto& t : pertes) {
        besoin = max(besoin, t.first - variation);
        variation += t.second;
    }
    cout << besoin << "\n";
    return 0;
}
