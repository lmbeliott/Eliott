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
    vector<pair<long long, long long>> pistes(n);   // (D, F)
    for (int i = 0; i < n; i++) cin >> pistes[i].first >> pistes[i].second;

    // a avant b si D_a / F_a < D_b / F_b, comparé sans division : D_a * F_b < D_b * F_a
    sort(pistes.begin(), pistes.end(), [](const pair<long long, long long>& a, const pair<long long, long long>& b) {
        return a.first * b.second < b.first * a.second;
    });
    long long temps = 0, attente = 0;
    for (const auto& p : pistes) {
        temps += p.first;              // la piste ouvre à ce moment
        attente += p.second * temps;   // chacun de ses skieurs a attendu `temps` minutes
    }
    cout << attente << "\n";
    return 0;
}
