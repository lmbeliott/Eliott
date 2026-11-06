#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> taches(n);   // (D, F)
    for (int i = 0; i < n; i++) cin >> taches[i].first >> taches[i].second;

    // a avant b si D_a / F_a < D_b / F_b, comparé sans division : D_a * F_b < D_b * F_a
    sort(taches.begin(), taches.end(), [](const pair<long long, long long>& a, const pair<long long, long long>& b) {
        return a.first * b.second < b.first * a.second;
    });
    long long temps = 0, attente = 0;
    for (const auto& t : taches) {
        temps += t.first;              // la tâche se termine à ce moment
        attente += t.second * temps;   // chacune de ses personnes a attendu `temps` minutes
    }
    cout << attente << "\n";
    return 0;
}
