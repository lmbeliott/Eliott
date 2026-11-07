#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <functional>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> taches(n);
    for (int i = 0; i < n; i++) cin >> taches[i].first >> taches[i].second;
    sort(taches.begin(), taches.end());          // par date limite croissante

    // tas des gains des tâches gardées (le plus petit en haut)
    priority_queue<long long, vector<long long>, greater<long long>> gardees;
    for (auto [limite, gain] : taches) {
        gardees.push(gain);
        if ((long long)gardees.size() > limite) {
            // trop de tâches pour tenir avant cette date : on abandonne la moins rentable
            gardees.pop();
        }
    }
    long long total = 0;
    while (!gardees.empty()) {
        total += gardees.top();
        gardees.pop();
    }
    cout << total << "\n";
    return 0;
}
