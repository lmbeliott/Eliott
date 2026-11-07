#include <algorithm>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> taches(n);   // (date limite, durée)
    for (int i = 0; i < n; i++) {
        cin >> taches[i].second >> taches[i].first;
    }
    sort(taches.begin(), taches.end());              // par date limite croissante
    priority_queue<long long> acceptees;             // donne la plus grande durée
    long long total = 0;
    for (auto& t : taches) {
        acceptees.push(t.second);
        total += t.second;
        if (total > t.first) {                       // en retard : on abandonne la plus longue
            total -= acceptees.top();
            acceptees.pop();
        }
    }
    cout << acceptees.size() << "\n";
    return 0;
}
